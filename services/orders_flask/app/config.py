# app/config.py

# Flask App Configuration
DEBUG = True  # Set to False in production

# SQLAlchemy Configuration
SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://user:password@postgres:5432/orders'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# RabbitMQ Configuration
RABBITMQ_HOST = 'rabbitmq'
RABBITMQ_PORT = 5672
RABBITMQ_USERNAME = 'username'
RABBITMQ_PASSWORD = 'password'
RABBITMQ_QUEUE = 'hello'
