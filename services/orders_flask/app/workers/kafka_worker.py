from kafka import KafkaConsumer

def kafka_consumer():
    consumer = KafkaConsumer('test', bootstrap_servers=['kafka:9092'])
    for message in consumer:
        print(f"Received message: {message.value.decode('utf-8')}")
