FROM python:3.12-slim as builder

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 🔥 CRITICAL FIX: inject secret key during build
ARG SECRET_KEY
ENV SECRET_KEY=$SECRET_KEY

RUN python manage.py collectstatic --noinput


FROM python:3.12-slim

WORKDIR /app

COPY --from=builder /app /app
COPY --from=builder /usr/local /usr/local

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

CMD ["gunicorn", "sweetshop.wsgi:application", "--bind", "0.0.0.0:8000"]