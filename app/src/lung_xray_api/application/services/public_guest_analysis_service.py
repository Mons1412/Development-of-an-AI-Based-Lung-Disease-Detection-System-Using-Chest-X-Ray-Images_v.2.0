from types import SimpleNamespace

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


PUBLIC_GUEST_MODEL = SimpleNamespace(
    id=0,
    model_key="mobilenetv2",
    display_name="MobileNetV2",
    architecture="MobileNetV2",
    version="1.1.0",
    artifact_path=(
        "app/artifacts/models/"
        "mobilenetv2/1.1.0"
    ),
    class_names=[
        "normal",
        "pneumonia",
        "tuberculosis",
    ],
    is_active=True,
    is_default=True,
)


class PublicGuestAnalysisService:

    @staticmethod
    def _model_info() -> dict:
        model = PUBLIC_GUEST_MODEL

        return {
            "display_name": model.display_name,
            "architecture": model.architecture,
            "version": model.version,
            "class_names": list(model.class_names),
        }

    def get_model_info(self) -> dict:
        return self._model_info()

    def analyze_image(
        self,
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

        batch = image_preprocessor.preprocess(
            image_bytes
        )

        runtime = runtime_manager.get_runtime(
            PUBLIC_GUEST_MODEL
        )

        prediction = runtime.predict(batch)

        return {
            "model": self._model_info(),
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


public_guest_analysis_service = (
    PublicGuestAnalysisService()
)