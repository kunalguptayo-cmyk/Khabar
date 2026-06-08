from datetime import date
from uuid import UUID

from pydantic import BaseModel, Field


class ArticleOut(BaseModel):
    id: UUID
    title: str
    summary: str | None
    url: str
    source: str
    topic: str
    reading_time_minutes: int
    score: float


class DigestOut(BaseModel):
    date: date
    articles: list[ArticleOut]
    topic_breakdown: dict[str, int]


class FeedbackIn(BaseModel):
    article_id: UUID
    feedback: str = Field(pattern="^(up|down)$")


class StatusOut(BaseModel):
    status: str
