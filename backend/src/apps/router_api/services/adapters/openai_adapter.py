import logging
from typing import Any

from fastapi import HTTPException, status
import httpx

from src.apps.router_api.schemas.completion import ChatCompletionRequest
from src.apps.router_api.services.adapters.base import (
    AdapterResult,
    BaseProviderAdapter,
)

logger = logging.getLogger(__name__)


class OpenAICompatibleAdapter(BaseProviderAdapter):
    """Adapter for OpenAI and OpenAI-compatible providers (DeepSeek, Kimi, Azure)."""

    def __init__(
        self,
        provider_name: str,
        base_url: str,
        api_key: str | None,
        timeout: float = 60.0,
    ) -> None:
        super().__init__(provider_name)
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout

    def _ensure_configured(self) -> None:
        if not self.api_key:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail={
                    "error": {
                        "message": (
                            f"Provider '{self.provider_name}' upstream API credentials are not configured. "
                            f"Live routing to '{self.provider_name}' is not supported yet without valid provider credentials."
                        ),
                        "type": "not_supported_error",
                        "code": "provider_not_configured",
                    }
                },
            )

    def _build_payload(self, request: ChatCompletionRequest, model_slug: str, stream: bool) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "model": model_slug,
            "messages": [m.model_dump(exclude_none=True) for m in request.messages],
            "stream": stream,
        }
        if request.temperature is not None:
            payload["temperature"] = request.temperature
        if request.top_p is not None:
            payload["top_p"] = request.top_p
        if request.max_tokens is not None:
            payload["max_tokens"] = request.max_tokens
        if request.stop is not None:
            payload["stop"] = request.stop
        if request.presence_penalty:
            payload["presence_penalty"] = request.presence_penalty
        if request.frequency_penalty:
            payload["frequency_penalty"] = request.frequency_penalty
        return payload

    async def complete(
        self,
        request: ChatCompletionRequest,
        model_slug: str,
    ) -> AdapterResult:
        self._ensure_configured()
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = self._build_payload(request, model_slug, stream=False)

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
            except httpx.RequestError as exc:
                logger.error("Request failed to upstream provider %s: %s", self.provider_name, exc)
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail={
                        "error": {
                            "message": f"Failed to connect to upstream provider '{self.provider_name}': {str(exc)}",
                            "type": "upstream_error",
                            "code": "upstream_connection_failed",
                        }
                    },
                )

        if response.is_error:
            try:
                err_body = response.json()
            except Exception:
                err_body = {"raw": response.text}
            logger.error("Upstream provider %s returned status %d: %s", self.provider_name, response.status_code, err_body)
            raise HTTPException(
                status_code=response.status_code if response.status_code in (400, 401, 403, 404, 429) else status.HTTP_502_BAD_GATEWAY,
                detail={
                    "error": {
                        "message": f"Upstream provider '{self.provider_name}' error: {err_body}",
                        "type": "upstream_error",
                        "code": "upstream_provider_error",
                    }
                },
            )

        data = response.json()
        choice = data.get("choices", [{}])[0]
        msg = choice.get("message", {})
        usage = data.get("usage", {})

        return AdapterResult(
            content=msg.get("content", ""),
            role=msg.get("role", "assistant"),
            finish_reason=choice.get("finish_reason", "stop"),
            prompt_tokens=usage.get("prompt_tokens", 0),
            completion_tokens=usage.get("completion_tokens", 0),
            total_tokens=usage.get("total_tokens", 0),
            raw_response=data,
        )

    async def complete_stream(
        self,
        request: ChatCompletionRequest,
        model_slug: str,
    ):
        raise NotImplementedError("Streaming is not yet implemented.")
