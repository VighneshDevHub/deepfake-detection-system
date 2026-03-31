FROM python:3.11-slim

WORKDIR /app

# System dependencies (optimized)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY . .

# Create required dirs
RUN mkdir -p models

# Dynamic port support
ENV PORT=8000

# Production server (IMPORTANT CHANGE)
CMD ["sh", "-c", "python scripts/download_models.py && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
