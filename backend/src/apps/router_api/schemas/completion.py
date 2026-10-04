from typing import Any, Literal
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant", "tool", "function"]
    content: str | list[dict[str, Any]] | None = None
    name: str | None = None
    tool_calls: list[dict[str, Any]] | None = None


class ChatCompletionRequest(BaseModel):
    model: str = Field(
        ...,
        description="ID of the model to use. Can be a pure model slug (e.g. 'gpt-5.5', 'claude-sonnet-4.5') or prefixed with provider (e.g. 'openai/gpt-5.5').",
    )
    messages: list[ChatMessage] = Field(
        ...,
        description="A list of messages comprising the conversation so far.",
        min_length=1,
    )
    temperature: float | None = Field(default=1.0, ge=0.0, le=2.0)
    top_p: float | None = Field(default=1.0, ge=0.0, le=1.0)
    n: int | None = Field(default=1, ge=1)
    stream: bool = Field(default=False, description="If set, partial message deltas will be sent as SSE data-only events.")
    stop: str | list[str] | None = None
    max_tokens: int | None = Field(default=None, ge=1)
    max_completion_tokens: int | None = Field(default=None, ge=1)
    presence_penalty: float | None = Field(default=0.0, ge=-2.0, le=2.0)
    frequency_penalty: float | None = Field(default=0.0, ge=-2.0, le=2.0)
    user: str | None = None

    # SyncRouter dynamic routing options
    provider: str | None = Field(
        default=None,
        description="Explicitly choose an upstream provider (e.g., 'OpenAI', 'Azure', 'Anthropic', 'Google AI Studio'). Overrides automatic cheapest routing.",
    )
    routing_strategy: str = Field(
        default="cheapest",
        description="Routing algorithm: 'cheapest' (default lowest token cost) or 'direct'.",
    )


class ChatCompletionResponseMessage(BaseModel):
    role: Literal["assistant"] = "assistant"
    content: str | None = None
    tool_calls: list[dict[str, Any]] | None = None


class ChatCompletionChoice(BaseModel):
    index: int = 0
    message: ChatCompletionResponseMessage
    finish_reason: str | None = "stop"


class ChatCompletionUsage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    input_cost: float | None = None
    output_cost: float | None = None
    total_cost: float | None = None
    routed_provider: str | None = None
    cost_saved: float | None = None


class ChatCompletionResponse(BaseModel):
    id: str
    object: Literal["chat.completion"] = "chat.completion"
    created: int
    model: str
    choices: list[ChatCompletionChoice]
    usage: ChatCompletionUsage
    system_fingerprint: str | None = None


class ChatCompletionChunkDelta(BaseModel):
    role: str | None = None
    content: str | None = None


class ChatCompletionChunkChoice(BaseModel):
    index: int = 0
    delta: ChatCompletionChunkDelta
    finish_reason: str | None = None


class ChatCompletionChunk(BaseModel):
    id: str
    object: Literal["chat.completion.chunk"] = "chat.completion.chunk"
    created: int
    model: str
    choices: list[ChatCompletionChunkChoice]
