import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from lung_xray_api.api.v1.public_guest import (
    router as public_guest_router,
)


DEFAULT_ALLOWED_ORIGINS = [
    "https://mons1412.github.io",
    "http://127.0.0.1:8002",
    "http://localhost:8002",
]


def get_allowed_origins() -> list[str]:
    raw_value = os.getenv(
        "GUEST_ALLOWED_ORIGINS",
        "",
    ).strip()

    if not raw_value:
        return DEFAULT_ALLOWED_ORIGINS

    return [
        origin.strip()
        for origin in raw_value.split(",")
        if origin.strip()
    ]


app = FastAPI(
    title="LungXrayAI 1.0 Guest API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=False,
    allow_methods=[
        "GET",
        "POST",
        "OPTIONS",
    ],
    allow_headers=[
        "Accept",
        "Content-Type",
    ],
)


@app.get(
    "/health/live",
    tags=["Health"],
)
def health_live():
    return {
        "status": "ok",
        "service": "lungxrayai-guest",
    }


@app.get(
    "/",
    include_in_schema=False,
)
def root():
    return {
        "service": "LungXrayAI 1.0 Guest API",
        "status": "available",
    }


app.include_router(
    public_guest_router
)