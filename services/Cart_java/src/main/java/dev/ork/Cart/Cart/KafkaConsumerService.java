package dev.ork.Cart.Cart;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "test", groupId = "1")
    public void listen(String message) {
        System.out.println("Received message: " + message);
        // Process the received message here
    }
}
