from fastapi import HTTPException, status

from src.apps.router_api.services.adapters.anthropic_adapter import AnthropicAdapter
from src.apps.router_api.services.adapters.base import BaseProviderAdapter
from src.apps.router_api.services.adapters.gemini_adapter import GeminiAdapter
from src.apps.router_api.services.adapters.openai_adapter import OpenAICompatibleAdapter
from src.shared.config import settings


def get_adapter_for_provider(provider_name: str) -> BaseProviderAdapter:
    """Instantiate and return the appropriate provider adapter by name."""
    norm = provider_name.strip().lower()

    if norm == "openai":
        return OpenAICompatibleAdapter(
            provider_name="OpenAI",
            base_url=settings.OPENAI_BASE_URL,
            api_key=settings.OPENAI_API_KEY,
        )
    elif norm in ("azure", "azure openai"):
        return OpenAICompatibleAdapter(
            provider_name="Azure",
            base_url=settings.OPENAI_BASE_URL,
            api_key=settings.OPENAI_API_KEY,
        )
    elif norm == "deepseek":
        return OpenAICompatibleAdapter(
            provider_name="DeepSeek",
            base_url=settings.DEEPSEEK_BASE_URL,
            api_key=settings.DEEPSEEK_API_KEY,
        )
    elif norm in ("kimi", "kimi moonshot", "moonshot"):
        return OpenAICompatibleAdapter(
            provider_name="Kimi Moonshot",
            base_url=settings.MOONSHOT_BASE_URL,
            api_key=settings.MOONSHOT_API_KEY,
        )
    elif norm == "anthropic":
        return AnthropicAdapter(
            provider_name="Anthropic",
            base_url=settings.ANTHROPIC_BASE_URL,
            api_key=settings.ANTHROPIC_API_KEY,
        )
    elif norm == "vertex":
        return AnthropicAdapter(
            provider_name="Vertex",
            base_url=settings.ANTHROPIC_BASE_URL,
            api_key=settings.ANTHROPIC_API_KEY,
        )
    elif norm in ("google", "google ai studio", "gemini"):
        return GeminiAdapter(
            provider_name="Google AI Studio",
            base_url=settings.GEMINI_BASE_URL,
            api_key=settings.GEMINI_API_KEY,
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail={
                "error": {
                    "message": f"Provider '{provider_name}' integration is not supported yet.",
                    "type": "not_supported_error",
                    "code": "provider_not_supported",
                }
            },
        )
