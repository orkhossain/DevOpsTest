import pika
import json

def rabbitmq_worker():

    try:
        credentials = pika.PlainCredentials('user', 'password')
        parameters = pika.ConnectionParameters(host='rabbitmq',
                                               port=5672,
                                               virtual_host='/',
                                               credentials=credentials)
        

        connection = pika.BlockingConnection(parameters)
        
    except pika.exceptions.AMQPConnectionError as exc:
        print("Failed to connect to RabbitMQ service. Message wont be sent.")
        return

    channel = connection.channel()
    channel.queue_declare(queue='hello', durable=True)

    print(' Waiting for messages...')


    def callback(ch, method, properties, body):
        print(f"Received message from RabbitMQ: {body.decode('utf-8')}")
        print(" Done")

        ch.basic_ack(delivery_tag=method.delivery_tag)


    channel.basic_consume(queue='hello', on_message_callback=callback)
    channel.start_consuming()


