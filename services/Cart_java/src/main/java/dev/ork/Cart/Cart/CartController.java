package dev.ork.Cart.Cart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/cart")

public class CartController {
  @Autowired
  private CartRepository cartRepository;

  @GetMapping
  public List<Cart> getAllCarts() {
    return cartRepository.findAll();
  }

  @GetMapping("/{id}")
  public Cart getCartById(@PathVariable Long id) {
    return cartRepository.findById(id).get();
  }

  @PostMapping
  public Cart createCart(@RequestBody Cart productID) {
    return cartRepository.save(productID);
  }

  @PutMapping("/{id}")
  public Cart updateCart(@PathVariable Long id, @RequestBody Cart productID) {
    Cart existingCart = cartRepository.findById(id).get();
    existingCart.setProductId(productID.getProductId());
    return cartRepository.save(existingCart);
  }

  @DeleteMapping("/{id}")
  public String deleteCart(@PathVariable Long id) {
    try {
      cartRepository.findById(id).get();
      cartRepository.deleteById(id);
      return "Cart deleted successfully";
    } catch (Exception e) {
      return "Cart not found";
    }
  }

}
