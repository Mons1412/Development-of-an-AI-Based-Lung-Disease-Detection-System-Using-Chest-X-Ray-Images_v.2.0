FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PYTHONPATH=/opt/lungxray/app/src

WORKDIR /opt/lungxray

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libgomp1 \
        fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./requirements.txt

RUN python -m pip install --upgrade pip \
    && python -m pip install -r requirements.txt

COPY . .

RUN mkdir -p \
    /opt/lungxray/app/var/uploads \
    /opt/lungxray/app/var/reports \
    /opt/lungxray/app/var/thumbnails \
    /opt/lungxray/app/var/logs \
    /opt/lungxray/var

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "lung_xray_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
