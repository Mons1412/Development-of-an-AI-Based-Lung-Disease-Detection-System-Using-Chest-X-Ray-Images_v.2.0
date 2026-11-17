from pydantic import BaseModel


class GuestModelInfoResponse(BaseModel):
    display_name: str
    architecture: str
    version: str
    class_names: list[str]


class GuestImageInfoResponse(BaseModel):
    image_format: str
    width: int
    height: int


class GuestPredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    probabilities: dict[str, float]


class GuestAnalysisResponse(BaseModel):
    model: GuestModelInfoResponse
    image: GuestImageInfoResponse
    prediction: GuestPredictionResponse
