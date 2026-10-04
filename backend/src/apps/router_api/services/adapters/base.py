from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator
from dataclasses import dataclass
from typing import Any

from src.apps.router_api.schemas.completion import ChatCompletionRequest


@dataclass
class AdapterResult:
    content: str
    role: str = "assistant"
    finish_reason: str = "stop"
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    raw_response: dict[str, Any] | None = None


@dataclass
class AdapterChunk:
    content: str | None
    role: str | None = None
    finish_reason: str | None = None


class BaseProviderAdapter(ABC):
    """Abstract base class for upstream provider adapters."""

    def __init__(self, provider_name: str) -> None:
        self.provider_name = provider_name

    @abstractmethod
    async def complete(
        self,
        request: ChatCompletionRequest,
        model_slug: str,
    ) -> AdapterResult:
        """Execute a non-streaming chat completion request."""
        pass

    @abstractmethod
    async def complete_stream(
        self,
        request: ChatCompletionRequest,
        model_slug: str,
    ) -> AsyncGenerator[AdapterChunk, None]:
        """Execute a streaming chat completion request yielding chunk deltas."""
        pass
