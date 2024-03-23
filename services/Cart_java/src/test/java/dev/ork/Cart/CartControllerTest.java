package dev.ork.Cart;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import dev.ork.Cart.Cart.Cart;
import dev.ork.Cart.Cart.CartController;
import dev.ork.Cart.Cart.CartRepository;

@ExtendWith(MockitoExtension.class)
public class CartControllerTest {

	@Mock
	private CartRepository cartRepository;

	@InjectMocks
	private CartController cartController;

	@Test
	void getAllCarts() {
		List<Cart> carts = new ArrayList<>();
		carts.add(new Cart("1", 2, 10.0, 1L));
		carts.add(new Cart("2", 1, 5.0, 2L));
		when(cartRepository.findAll()).thenReturn(carts);

		List<Cart> result = cartController.getAllCarts();

		assertEquals(2, result.size());
	}

	@Test
	void getCartById_ExistingId() {
		Long id = 1L;
		Cart cart = new Cart("1", 2, 10.0, 1L);
		when(cartRepository.findById(id)).thenReturn(Optional.of(cart));

		Cart result = cartController.getCartById(id);

		assertEquals(cart, result);
	}

	@Test
	void getCartById_NonExistingId() {
		Long id = 1L;
		when(cartRepository.findById(id)).thenReturn(Optional.empty());

		Cart result = cartController.getCartById(id);

		assertEquals(null, result);
	}

	@Test
	void createCart() {
		Cart cart = new Cart("1", 2, 10.0, 1L);
		when(cartRepository.save(cart)).thenReturn(cart);

		Cart result = cartController.createCart(cart);

		assertEquals(cart, result);
	}

	@Test
	void updateCart_ExistingId() {
		Long id = 1L;
		Cart existingCart = new Cart("1", 2, 10.0, 1L);
		Cart updatedCart = new Cart("2", 3, 15.0, 1L);
		when(cartRepository.findById(id)).thenReturn(Optional.of(existingCart));
		when(cartRepository.save(existingCart)).thenReturn(existingCart);

		Cart result = cartController.updateCart(id, updatedCart);

		assertEquals(updatedCart.getProductId(), result.getProductId());
		assertEquals(updatedCart.getQuantity(), result.getQuantity());
		assertEquals(updatedCart.getUnitPrice(), result.getUnitPrice());
	}

	@Test
	void updateCart_NonExistingId() {
		Long id = 1L;
		Cart updatedCart = new Cart("2", 3, 15.0, 1L);
		when(cartRepository.findById(id)).thenReturn(Optional.empty());

		Cart result = cartController.updateCart(id, updatedCart);

		assertEquals(null, result);
	}

	@Test
	void deleteCart_ExistingId() {
		Long id = 1L;
		when(cartRepository.existsById(id)).thenReturn(true);

		String result = cartController.deleteCart(id);

		assertEquals("Cart deleted successfully", result);
		verify(cartRepository, times(1)).deleteById(id);
	}

	@Test
	void deleteCart_NonExistingId() {
		Long id = 1L;
		when(cartRepository.existsById(id)).thenReturn(false);

		String result = cartController.deleteCart(id);

		assertEquals("Cart not found", result);
		verify(cartRepository, never()).deleteById(id);
	}
}
