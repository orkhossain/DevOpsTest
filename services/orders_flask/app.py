from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
# from kafka import KafkaConsumer
import pika
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://user:password@postgres:5432/orders'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Order(db.Model):
    __tablename__ = 'Order'
    __table_args__ = {'schema': 'public'} 

    id = db.Column(db.Text, primary_key=True)
    description = db.Column(db.Text)
    
@app.route('/orders', methods=['POST'])
def create_order():
    try:
        order_data = request.get_json()
        order_id = order_data.get('id')
        order_description = order_data.get('description')

        if not order_id or not order_description:
            raise ValueError('Missing order ID or description')

        new_order = Order(id=order_id, description=order_description)
        db.session.add(new_order)
        db.session.commit()

        return jsonify({'message': 'Order created'}), 201
    except (KeyError, ValueError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/orders/<string:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get(id)
    if order:
        return jsonify({'id': order.id, 'description': order.description})
    return jsonify({'error': 'Order not found'}), 404

@app.route('/orders/<string:id>', methods=['PUT'])
def update_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        order_data = request.get_json()
        new_description = order_data.get('description')

        if not new_description:
            raise ValueError('Missing description')

        order.description = new_description
        db.session.commit()
        return jsonify({'message': 'Order updated'})
    except (KeyError, ValueError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/orders/<string:id>', methods=['DELETE'])
def delete_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# def kafka_consumer():
#     consumer = KafkaConsumer('test', bootstrap_servers=['kafka:9092'])
#     for message in consumer:
#         print(f"Received message: {message.value.decode('utf-8')}")

def rabbitmq_worker():

    try:
        credentials = pika.PlainCredentials('user', 'password')
        parameters = pika.ConnectionParameters(host='rabbitmq',
                                               port=5672,
                                               credentials=credentials)
        

        connection = pika.BlockingConnection(parameters)
        
    except pika.exceptions.AMQPConnectionError as exc:
        print("Failed to connect to RabbitMQ service. Message wont be sent.")
        return

    channel = connection.channel()
    channel.queue_declare(queue='task_queue', durable=True)

    print(' Waiting for messages...')


    def callback(ch, method, properties, body):
        print(" Received %s" % body.decode())
        print(" Done")

        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='task_queue', on_message_callback=callback)
    channel.start_consuming()


    # try:
    #     credentials = pika.PlainCredentials('user', 'password')
    #     parameters = pika.ConnectionParameters(host='rabbitmq',
    #                                            port=5672,
    #                                            credentials=credentials)
    #     connection = pika.BlockingConnection(parameters)
    #     channel = connection.channel()
    #     channel.queue_declare(queue='hello', durable=True)

    #     def callback(ch, method, properties, body):
    #         print(f"Received message from RabbitMQ: {body.decode('utf-8')}")

    #     channel.basic_consume(queue='hello', on_message_callback=callback, auto_ack=True)
    #     print('Waiting for messages from RabbitMQ...')
    #     channel.start_consuming()
    # except Exception as e:
    #     print(f"Error occurred: {str(e)}")


if __name__ == '__main__':
    from threading import Thread

    # Start Kafka consumer in a separate thread
    # kafka_thread = Thread(target=kafka_consumer)
    # kafka_thread.daemon = True
    # kafka_thread.start()

    # Start RabbitMQ worker in a separate thread
    rabbitmq_thread = Thread(target=rabbitmq_worker)
    rabbitmq_thread.daemon = True
    rabbitmq_thread.start()

    # rabbitmq_worker()
    app.run(debug=True,host='0.0.0.0', port=5000)
