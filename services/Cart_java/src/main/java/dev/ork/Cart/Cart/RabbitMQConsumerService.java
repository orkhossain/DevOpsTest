package dev.ork.Cart.Cart;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQConsumerService {

    @RabbitListener(queues = "hello")
    public void receiveMessage(String message) {
        System.out.println("Received message from RabbitMQ: " + message);
        // Process the received message here
    }
}