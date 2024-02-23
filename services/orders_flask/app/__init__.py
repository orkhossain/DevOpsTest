from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from threading import Thread
from app.workers import rabbitmq_worker

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://user:password@postgres:5432/orders'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app.routes import order_routes 

rabbitmq_thread = Thread(target=rabbitmq_worker.rabbitmq_worker)
rabbitmq_thread.daemon = True
rabbitmq_thread.start()


if __name__ == '__main__':
    app.run(debug=True,threaded=True,processes=2, host='0.0.0.0', port=5000)