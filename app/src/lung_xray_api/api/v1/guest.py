import logging
from threading import BoundedSemaphore
from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from lung_xray_api.application.services.guest_analysis_service import (
    guest_analysis_service,
)
from lung_xray_api.core.guest_rate_limiter import (
    guest_rate_limiter,
)
from lung_xray_api.infrastructure.imaging.image_validator import (
    MAX_IMAGE_BYTES,
)
from lung_xray_api.infrastructure.persistence.database import (
    get_db,
)
from lung_xray_api.schemas.guest import (
    GuestAnalysisResponse,
    GuestModelInfoResponse,
)


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/guest",
    tags=["Guest Demo"],
)

# One Guest inference at a time per application process.
_guest_inference_semaphore = BoundedSemaphore(1)


@router.get(
    "/model-info",
    response_model=GuestModelInfoResponse,
)
def get_guest_model_info(
    db: Session = Depends(get_db),
):

    try:
        return guest_analysis_service.get_model_info(db)

    except LookupError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Guest demo is temporarily unavailable.",
        )

    except Exception:
        logger.exception("Guest model-info request failed.")

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Guest demo is temporarily unavailable.",
        )


@router.post(
    "/analyze",
    response_model=GuestAnalysisResponse,
)
def analyze_guest_image(
    request: Request,
    file: Annotated[
        UploadFile,
        File(
            description=(
                "JPEG or PNG chest X-ray image. "
                "Maximum size: 10 MB."
            )
        ),
    ],
    db: Session = Depends(get_db),
):

    client_ip = (
        request.client.host
        if request.client
        else "unknown"
    )

    # Rate limit is applied before processing the image.
    guest_rate_limiter.check(client_ip)

    # Reject concurrent Guest inference requests.
    if not _guest_inference_semaphore.acquire(
        blocking=False
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Guest analysis is busy. "
                "Please try again shortly."
            ),
            headers={
                "Retry-After": "5"
            },
        )

    try:

        try:
            image_bytes = file.file.read(
                MAX_IMAGE_BYTES + 1
            )

        finally:
            file.file.close()

        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file is empty.",
            )

        if len(image_bytes) > MAX_IMAGE_BYTES:
            raise HTTPException(
                status_code=(
                    status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
                ),
                detail="Image exceeds the 10 MB limit.",
            )

        return guest_analysis_service.analyze_image(
            db,
            image_bytes=image_bytes,
            content_type=file.content_type,
        )

    except HTTPException:
        raise

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )

    except LookupError:
        logger.exception("Guest AI model unavailable.")

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Guest AI model is temporarily unavailable.",
        )

    except Exception:
        logger.exception("Guest image analysis failed.")

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Guest analysis failed. Please try again later.",
        )

    finally:
        _guest_inference_semaphore.release()
