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


class AnthropicAdapter(BaseProviderAdapter):
    """Adapter for Anthropic Claude REST API."""

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

    def _convert_messages(self, request: ChatCompletionRequest) -> tuple[str | None, list[dict[str, Any]]]:
        system_prompt: str | None = None
        converted: list[dict[str, Any]] = []

        for msg in request.messages:
            if msg.role == "system":
                system_prompt = str(msg.content or "")
            else:
                role = "assistant" if msg.role == "assistant" else "user"
                converted.append({
                    "role": role,
                    "content": str(msg.content or ""),
                })

        return system_prompt, converted

    async def complete(
        self,
        request: ChatCompletionRequest,
        model_slug: str,
    ) -> AdapterResult:
        self._ensure_configured()
        url = f"{self.base_url}/v1/messages"
        headers = {
            "x-api-key": self.api_key or "",
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

        system_prompt, messages = self._convert_messages(request)
        max_tokens = request.max_tokens or 2048

        payload: dict[str, Any] = {
            "model": model_slug,
            "messages": messages,
            "max_tokens": max_tokens,
        }
        if system_prompt:
            payload["system"] = system_prompt
        if request.temperature is not None:
            payload["temperature"] = max(0.0, min(1.0, request.temperature))
        if request.top_p is not None:
            payload["top_p"] = request.top_p

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
            except httpx.RequestError as exc:
                logger.error("Request failed to Anthropic: %s", exc)
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail={
                        "error": {
                            "message": f"Failed to connect to Anthropic: {str(exc)}",
                            "type": "upstream_error",
                            "code": "upstream_connection_failed",
                        }
                    },
                )

        if response.is_error:
            logger.error("Anthropic error status %d: %s", response.status_code, response.text)
            raise HTTPException(
                status_code=response.status_code if response.status_code in (400, 401, 403, 404, 429) else status.HTTP_502_BAD_GATEWAY,
                detail={
                    "error": {
                        "message": f"Anthropic error: {response.text}",
                        "type": "upstream_error",
                        "code": "upstream_provider_error",
                    }
                },
            )

        data = response.json()
        content_blocks = data.get("content", [])
        combined_text = "".join(b.get("text", "") for b in content_blocks if b.get("type") == "text")
        usage = data.get("usage", {})

        return AdapterResult(
            content=combined_text,
            role="assistant",
            finish_reason=data.get("stop_reason") or "stop",
            prompt_tokens=usage.get("input_tokens", 0),
            completion_tokens=usage.get("output_tokens", 0),
            total_tokens=usage.get("input_tokens", 0) + usage.get("output_tokens", 0),
            raw_response=data,
        )

    async def complete_stream(
        self,
        request: ChatCompletionRequest,
        model_slug: str,
    ):
        raise NotImplementedError("Streaming is not yet implemented.")
