import pika
import json

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

