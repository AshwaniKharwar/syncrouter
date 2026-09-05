import asyncio
import json
import logging
from pathlib import Path
from sqlalchemy import select
from src.shared.database import async_session_maker
from src.shared.models.ai_company import AICompany
from src.shared.models.ai_provider import AIProvider
from src.shared.models.ai_model import AIModel
from src.shared.models.model_provider_mapping import ModelProviderMapping

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODELS_JSON_PATH = Path(__file__).resolve().parents[2] / "models.json"


async def seed_from_json(json_path: Path = MODELS_JSON_PATH) -> None:
    """Seed companies, providers, models, and provider-specific mappings from models.json."""
    if not json_path.exists():
        logger.error("Data file %s does not exist", json_path)
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    async with async_session_maker() as session:
        # Helper to upsert a company
        company_map: dict[str, AICompany] = {}
        for company_data in data.get("companies", []):
            name = company_data["name"]
            website = company_data.get("website")
            result = await session.execute(
                select(AICompany).where(AICompany.name == name)
            )
            company = result.scalar_one_or_none()
            if not company:
                company = AICompany(name=name, website=website)
                session.add(company)
                await session.flush()
                logger.info("Added company: %s (%s)", name, website)
            else:
                if website and company.website != website:
                    company.website = website
                    logger.info("Updated company website: %s -> %s", name, website)
            company_map[name] = company

        # Upsert Providers and Provider-specific Model Mappings
        for provider_data in data.get("providers", []):
            prov_name = provider_data["name"]
            prov_website = provider_data.get("website")

            res = await session.execute(
                select(AIProvider).where(AIProvider.name == prov_name)
            )
            provider = res.scalar_one_or_none()
            if not provider:
                provider = AIProvider(name=prov_name, website=prov_website)
                session.add(provider)
                await session.flush()
                logger.info("Added provider: %s (%s)", prov_name, prov_website)
            else:
                if prov_website and provider.website != prov_website:
                    provider.website = prov_website
                    logger.info("Updated provider website: %s -> %s", prov_name, prov_website)

            # Process models offered by this specific provider
            for model_info in provider_data.get("models", []):
                model_name = model_info["name"]
                model_slug = model_info["slug"]
                model_company_name = model_info.get("company", prov_name)
                company = company_map.get(model_company_name)

                if not company:
                    # Create company if not already registered
                    res_c = await session.execute(
                        select(AICompany).where(AICompany.name == model_company_name)
                    )
                    company = res_c.scalar_one_or_none()
                    if not company:
                        company = AICompany(name=model_company_name)
                        session.add(company)
                        await session.flush()
                    company_map[model_company_name] = company

                # Upsert model
                m_res = await session.execute(
                    select(AIModel).where(AIModel.slug == model_slug)
                )
                model = m_res.scalar_one_or_none()
                if not model:
                    model = AIModel(
                        company_id=company.id,
                        name=model_name,
                        slug=model_slug,
                    )
                    session.add(model)
                    await session.flush()
                    logger.info("Added model: %s (%s)", model_name, model_slug)
                else:
                    if model.name != model_name or model.company_id != company.id:
                        model.name = model_name
                        model.company_id = company.id
                        logger.info("Updated model: %s", model_slug)

                # Upsert provider-specific ModelProviderMapping
                in_cost = float(model_info.get("input_token_cost", 0.0))
                out_cost = float(model_info.get("output_token_cost", 0.0))

                map_res = await session.execute(
                    select(ModelProviderMapping).where(
                        ModelProviderMapping.model_id == model.id,
                        ModelProviderMapping.provider_id == provider.id,
                    )
                )
                mapping = map_res.scalar_one_or_none()
                if not mapping:
                    mapping = ModelProviderMapping(
                        model_id=model.id,
                        provider_id=provider.id,
                        input_token_cost=in_cost,
                        output_token_cost=out_cost,
                    )
                    session.add(mapping)
                    logger.info(
                        "Created mapping for Provider '%s' -> Model '%s' (in: $%s, out: $%s)",
                        prov_name,
                        model_slug,
                        in_cost,
                        out_cost,
                    )
                else:
                    if mapping.input_token_cost != in_cost or mapping.output_token_cost != out_cost:
                        mapping.input_token_cost = in_cost
                        mapping.output_token_cost = out_cost
                        logger.info(
                            "Updated mapping for Provider '%s' -> Model '%s' (in: $%s, out: $%s)",
                            prov_name,
                            model_slug,
                            in_cost,
                            out_cost,
                        )

        await session.commit()
        logger.info("Database seeding completed successfully.")


if __name__ == "__main__":
    asyncio.run(seed_from_json())
