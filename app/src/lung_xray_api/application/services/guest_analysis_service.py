from sqlalchemy.orm import Session

from lung_xray_api.application.services.ai_model_service import (
    ai_model_service,
)
from lung_xray_api.infrastructure.imaging.image_validator import (
    image_validator,
)
from lung_xray_api.infrastructure.imaging.semantic_chest_xray_validator import (
    semantic_chest_xray_validator,
)
from lung_xray_api.infrastructure.ml.image_preprocessor import (
    image_preprocessor,
)
from lung_xray_api.infrastructure.ml.runtime_manager import (
    runtime_manager,
)


class GuestAnalysisService:

    @staticmethod
    def _model_info(model_record) -> dict:
        return {
            "display_name": model_record.display_name,
            "architecture": model_record.architecture,
            "version": model_record.version,
            "class_names": list(
                model_record.class_names
            ),
        }

    def get_model_info(
        self,
        db: Session,
    ) -> dict:

        model_record = (
            ai_model_service.get_default_model(db)
        )

        return self._model_info(model_record)

    def analyze_image(
        self,
        db: Session,
        *,
        image_bytes: bytes,
        content_type: str | None,
    ) -> dict:

        validated_image = image_validator.validate(
            image_bytes,
            content_type,
        )

        chest_xray_result = (
            semantic_chest_xray_validator.validate(
                image_bytes
            )
        )

        if not chest_xray_result.accepted:
            raise ValueError(
                "Image does not appear to be "
                "a chest X-ray."
            )

        model_record = (
            ai_model_service.get_default_model(db)
        )

        batch = image_preprocessor.preprocess(
            image_bytes
        )

        runtime = runtime_manager.get_runtime(
            model_record
        )

        prediction = runtime.predict(batch)

        return {
            "model": self._model_info(model_record),
            "image": {
                "image_format": validated_image.image_format,
                "width": validated_image.width,
                "height": validated_image.height,
            },
            "prediction": {
                "predicted_class": prediction.predicted_class,
                "confidence": float(prediction.confidence),
                "probabilities": {
                    name: float(value)
                    for name, value
                    in prediction.probabilities.items()
                },
            },
        }


guest_analysis_service = GuestAnalysisService()
