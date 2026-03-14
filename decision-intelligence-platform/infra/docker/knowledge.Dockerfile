FROM python:3.9-slim

WORKDIR /app

COPY ./services/knowledge/pyproject.toml ./pyproject.toml
RUN pip install --no-cache-dir -r <(pip freeze)

COPY ./services/knowledge/app ./app

CMD ["python", "app/main.py"]