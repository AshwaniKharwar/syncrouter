from collections.abc import AsyncGenerator
import json
import logging
from typing import Any

from fastapi import HTTPException, status
import httpx

from src.apps.router_api.schemas.completion import ChatCompletionRequest
from src.apps.router_api.services.adapters.base import (
    AdapterChunk,
    AdapterResult,
    BaseProviderAdapter,
)

logger = logging.getLogger(__name__)


class GeminiAdapter(BaseProviderAdapter):
    """Adapter for Google AI Studio / Gemini REST API."""

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

    def _build_contents(self, request: ChatCompletionRequest) -> tuple[dict[str, Any] | None, list[dict[str, Any]]]:
        system_instruction: dict[str, Any] | None = None
        contents: list[dict[str, Any]] = []

        for msg in request.messages:
            if msg.role == "system":
                system_instruction = {"parts": [{"text": str(msg.content or "")}]}
            else:
                role = "model" if msg.role == "assistant" else "user"
                contents.append({
                    "role": role,
                    "parts": [{"text": str(msg.content or "")}],
                })

        return system_instruction, contents

    async def complete(
        self,
        request: ChatCompletionRequest,
        model_slug: str,
    ) -> AdapterResult:
        self._ensure_configured()
        url = f"{self.base_url}/models/{model_slug}:generateContent?key={self.api_key}"

        system_instruction, contents = self._build_contents(request)
        payload: dict[str, Any] = {"contents": contents}
        if system_instruction:
            payload["systemInstruction"] = system_instruction

        generation_config: dict[str, Any] = {}
        if request.temperature is not None:
            generation_config["temperature"] = request.temperature
        if request.top_p is not None:
            generation_config["topP"] = request.top_p
        if request.max_tokens is not None:
            generation_config["maxOutputTokens"] = request.max_tokens
        if generation_config:
            payload["generationConfig"] = generation_config

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(url, json=payload)
            except httpx.RequestError as exc:
                logger.error("Request failed to Gemini: %s", exc)
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail={
                        "error": {
                            "message": f"Failed to connect to Google Gemini: {str(exc)}",
                            "type": "upstream_error",
                            "code": "upstream_connection_failed",
                        }
                    },
                )

        if response.is_error:
            logger.error("Gemini error status %d: %s", response.status_code, response.text)
            raise HTTPException(
                status_code=response.status_code if response.status_code in (400, 401, 403, 404, 429) else status.HTTP_502_BAD_GATEWAY,
                detail={
                    "error": {
                        "message": f"Google Gemini error: {response.text}",
                        "type": "upstream_error",
                        "code": "upstream_provider_error",
                    }
                },
            )

        data = response.json()
        candidates = data.get("candidates", [{}])
        first_candidate = candidates[0] if candidates else {}
        parts = first_candidate.get("content", {}).get("parts", [])
        combined_text = "".join(p.get("text", "") for p in parts if "text" in p)
        usage_metadata = data.get("usageMetadata", {})

        prompt_toks = usage_metadata.get("promptTokenCount", 0)
        cand_toks = usage_metadata.get("candidatesTokenCount", 0)
        total_toks = usage_metadata.get("totalTokenCount", prompt_toks + cand_toks)

        return AdapterResult(
            content=combined_text,
            role="assistant",
            finish_reason=first_candidate.get("finishReason", "stop"),
            prompt_tokens=prompt_toks,
            completion_tokens=cand_toks,
            total_tokens=total_toks,
            raw_response=data,
        )

    async def complete_stream(
        self,
        request: ChatCompletionRequest,
        model_slug: str,
    ) -> AsyncGenerator[AdapterChunk, None]:
        self._ensure_configured()
        url = f"{self.base_url}/models/{model_slug}:streamGenerateContent?key={self.api_key}&alt=sse"

        system_instruction, contents = self._build_contents(request)
        payload: dict[str, Any] = {"contents": contents}
        if system_instruction:
            payload["systemInstruction"] = system_instruction

        generation_config: dict[str, Any] = {}
        if request.temperature is not None:
            generation_config["temperature"] = request.temperature
        if request.top_p is not None:
            generation_config["topP"] = request.top_p
        if request.max_tokens is not None:
            generation_config["maxOutputTokens"] = request.max_tokens
        if generation_config:
            payload["generationConfig"] = generation_config

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream("POST", url, json=payload) as response:
                if response.is_error:
                    await response.aread()
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail={
                            "error": {
                                "message": f"Gemini streaming error: {response.text}",
                                "type": "upstream_error",
                                "code": "upstream_streaming_error",
                            }
                        },
                    )

                async for line in response.aiter_lines():
                    clean_line = line.strip()
                    if not clean_line or not clean_line.startswith("data: "):
                        continue
                    data_str = clean_line.removeprefix("data: ").strip()
                    try:
                        event_data = json.loads(data_str)
                        candidates = event_data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            text = "".join(p.get("text", "") for p in parts if "text" in p)
                            if text:
                                yield AdapterChunk(content=text)
                    except json.JSONDecodeError:
                        continue
