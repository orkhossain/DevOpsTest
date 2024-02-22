package dev.ork.Cart.Cart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

  @Autowired
  private CartRepository cartRepository;

  @GetMapping
  public List<Cart> getAllCarts() {
    return cartRepository.findAll();
  }

  @SuppressWarnings("null")
  @GetMapping("/{id}")
  public Cart getCartById(@PathVariable Long id) {
    return cartRepository.findById(id).orElse(null);
  }

  @SuppressWarnings("null")
  @PostMapping
  public Cart createCart(@RequestBody Cart cart) {
    return cartRepository.save(cart);
  }

  @SuppressWarnings("null")
  @PutMapping("/{id}")
  public Cart updateCart(@PathVariable Long id, @RequestBody Cart updatedCart) {
    return cartRepository.findById(id).map(cart -> {
      cart.setProductId(updatedCart.getProductId());
      return cartRepository.save(cart);
    }).orElse(null);
  }

  @SuppressWarnings("null")
  @DeleteMapping("/{id}")
  public String deleteCart(@PathVariable Long id) {
    if (cartRepository.existsById(id)) {
      cartRepository.deleteById(id);
      return "Cart deleted successfully";
    } else {
      return "Cart not found";
    }
  }
}
