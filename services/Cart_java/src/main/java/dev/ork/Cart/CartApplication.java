package dev.ork.Cart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.SpringVersion;

@SpringBootApplication
public class CartApplication {

	public static void main(String[] args) {
		System.out.println("Hello");
		System.out.println("version: " + SpringVersion.getVersion());

		SpringApplication.run(CartApplication.class, args);
	}

}
