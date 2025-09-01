import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/cart.module.sass";
import Router from "next/router";
import axios from "axios";
import TrashIcon from "../public/icon/trash.svg";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [smallScreen, setSmallScreen] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          try {
            const res = await axios.get(
              `${API}/api/product/${item.product_id}`
            );
            return {
              ...item,
              product: res.data,
            };
          } catch (error) {
            return item;
          }
        })
      );

      setCartItems(updatedCart);
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (index, value) => {
    const newCartItems = [...cartItems];
    const quantity = Math.max(1, Number(value) || 1);
    newCartItems[index].quantity = quantity;
    setCartItems(newCartItems);
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity = Number(value);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleIncrement = (index) => {
    handleQuantityChange(index, cartItems[index].quantity + 1);
  };

  const handleDecrement = (index) => {
    handleQuantityChange(index, cartItems[index].quantity - 1);
  };

  return (
    <div className={styles.cart}>
      <div className={styles.container}>
        <div className={styles.bar}>
          <h1>Your cart</h1>
          <Link
            href="/catalog"
            className={styles.backToCatalog}
            onClick={() => {
              Router.push("/catalog");
            }}
          >
            Continue shopping
          </Link>
        </div>
        <div className={styles.infoCart}>
          <p>PRODUCT</p>
          <div className={styles.cartDetails}>
            <p>QUANTITY</p>
            <p>TOTAL</p>
          </div>
        </div>
        <div className={styles.cartItems}>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <div className={styles.itemDetails}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: "100px", borderRadius: "10px" }}
                  />
                  <div className={styles.itemInfo}>
                    <Link
                      href={`/product/${item.product_id}`}
                      className={styles.itemName}
                    >
                      {item.product.name}
                    </Link>
                    <p>Size: {item.size}</p>
                    <p>Color: {item.color}</p>
                  </div>
                </div>
                <div className={styles.itemPrices}>
                  {smallScreen ? (
                    <>
                      <div className={styles.removeItem}>
                        <TrashIcon
                          onClick={() => {
                            const newCartItems = cartItems.filter(
                              (_, i) => i !== index
                            );
                            setCartItems(newCartItems);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(newCartItems)
                            );
                          }}
                        />
                      </div>
                      <div className={styles.itemQuantity}>
                        <button
                          onClick={() => handleDecrement(index)}
                          className={styles.firstChild}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          min="1"
                          maxLength={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          style={{
                            width: "50px",
                            textAlign: "center",
                          }}
                        />
                        <button
                          onClick={() => handleIncrement(index)}
                          className={styles.lastChild}
                        >
                          +
                        </button>
                      </div>
                      <div className={styles.itemTotal}>
                        <span>{item.product.price * item.quantity} DZD</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.itemQuantity}>
                        <button
                          onClick={() => handleDecrement(index)}
                          className={styles.firstChild}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          min="1"
                          maxLength={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          style={{
                            width: "50px",
                            textAlign: "center",
                          }}
                        />
                        <button
                          onClick={() => handleIncrement(index)}
                          className={styles.lastChild}
                        >
                          +
                        </button>
                      </div>
                      <div className={styles.removeItem}>
                        <span
                          onClick={() => {
                            const newCartItems = cartItems.filter(
                              (_, i) => i !== index
                            );
                            setCartItems(newCartItems);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(newCartItems)
                            );
                          }}
                        >
                          Remove
                        </span>
                      </div>
                      <div className={styles.itemTotal}>
                        <span>{item.product.price * item.quantity} DZD</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
            </div>
          )}
        </div>
        <div className={styles.cartSummary}>
          <div className={styles.totalPrice}>
            <h3>
              <span>Total Price:</span>
              <span>
                {cartItems.reduce(
                  (total, item) => total + item.product.price * item.quantity,
                  0
                )}{" "}
                DZD
              </span>
            </h3>

            <p>Shipping costs calculated at checkout.</p>

            <div className={styles.checkoutButtonContainer}>
              <button className={styles.checkoutButton}>
                <Link
                  href={cartItems.length !== 0 ? "/checkout" : "/cart"}
                  className={styles.changepage}
                >
                  Proceed to Checkout
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
