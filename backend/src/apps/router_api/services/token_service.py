from datetime import datetime, timezone
import math
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from src.apps.router_api.schemas.completion import ChatMessage
from src.shared.models.model_provider_mapping import ModelProviderMapping
from src.shared.models.user_credit import UserCredit


def estimate_message_tokens(messages: Sequence[ChatMessage]) -> int:
    """Estimate prompt tokens for a sequence of chat messages.
    
    Uses standard tokenizer estimation heuristic (roughly 4 characters per token
    plus per-message metadata framing overhead).
    """
    total_tokens = 3  # priming tokens (every reply is primed with <|start|>assistant<|message|>)
    for msg in messages:
        total_tokens += 4  # message overhead: <|im_start|>{role/name}\n{content}<|im_end|>\n
        if msg.role:
            total_tokens += max(1, math.ceil(len(msg.role) / 4))
        if msg.name:
            total_tokens += max(1, math.ceil(len(msg.name) / 4))
        if msg.content:
            if isinstance(msg.content, str):
                total_tokens += max(1, math.ceil(len(msg.content) / 4))
            elif isinstance(msg.content, list):
                for item in msg.content:
                    if isinstance(item, dict) and "text" in item:
                        total_tokens += max(1, math.ceil(len(str(item["text"])) / 4))
    return max(1, total_tokens)


def estimate_string_tokens(text: str) -> int:
    """Estimate token count for a completion string."""
    if not text:
        return 0
    return max(1, math.ceil(len(text) / 4))


def calculate_cost(
    prompt_tokens: int,
    completion_tokens: int,
    mapping: ModelProviderMapping,
) -> tuple[float, float, float]:
    """Calculate input, output, and total USD cost for a given provider mapping.
    
    Costs in ModelProviderMapping are stored as price per 1,000,000 tokens.
    """
    input_cost = (prompt_tokens * float(mapping.input_token_cost)) / 1_000_000.0
    output_cost = (completion_tokens * float(mapping.output_token_cost)) / 1_000_000.0
    total_cost = round(input_cost + output_cost, 6)
    return round(input_cost, 6), round(output_cost, 6), total_cost


async def deduct_user_credits(
    db: AsyncSession,
    credit: UserCredit | None,
    credits_to_deduct: int = 1,
) -> int | None:
    """Deduct credits from the user credit record and commit transaction."""
    if credit is None:
        return None

    credit.credits = max(0, credit.credits - credits_to_deduct)
    credit.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(credit)
    return credit.credits
