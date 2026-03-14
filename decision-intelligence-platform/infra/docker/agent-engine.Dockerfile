FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY ./services/agent-engine/pyproject.toml .

# Install dependencies
RUN pip install --no-cache-dir -r <(pip freeze)

# Copy the application code
COPY ./services/agent-engine/app ./app

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["python", "main.py"]