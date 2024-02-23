from confluent_kafka import Consumer, KafkaError

conf = {
    'bootstrap.servers': 'kafka:9092',  
    'group.id': '1',       
    'auto.offset.reset': 'earliest' 
}

def kafka_consumer():
    consumer = Consumer(conf)
    consumer.subscribe(['test'])

    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue

        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(f'Error: {msg.error()}')
                continue

        message_value = msg.value().decode('utf-8')
        print(f'Received message: {message_value}')

