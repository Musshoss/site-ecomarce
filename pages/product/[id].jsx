import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import ImagesComp from "../../compoents/imagesComp/images";
import styles from "../../styles/productPage.module.sass";
import Loading from "../../compoents/loading/loading";
import Formillare from "../../compoents/formillare/formillare";
const Product = () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [product, setProduct] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [showMore, setShowMore] = useState(true);
  const MAXLENGTH = 250;
  const [discriptionText, setDiscriptionText] = useState("");
  const [message, setMessage] = useState("");
  const [lastProduct, setLastProduct] = useState({});
  const addingProduct = () => {
    if (!activeSize || !activeColor) {
      setMessage("Please select a size and color before adding to cart.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }
    // check if the product is already in the cart
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isProductInCart = existingCart.some(
      (item) =>
        item.product_id === product._id &&
        item.size === activeSize &&
        item.color === activeColor
    );
    if (isProductInCart) {
      setMessage("This product is already in your cart.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }
    const productData = {
      product_id: product._id,
      size: activeSize,
      color: activeColor,
      quantity: 1,
    };

    setLastProduct(productData);
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(productData);
    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
    // Display success message
    setMessage("Product added to cart successfully!");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // ############################# fetch the product ######################################
  useEffect(() => {
    if (!id) return;
    const res = async () => {
      try {
        const response = await axios.get(
          `${API}/api/product/${id}`
        );
        setProduct(response.data);
        console.log("Product fetched:", response.data);
      } catch (error) {}
    };
    res();
  }, [id]);
  // ######################## check if the description is overflowing ##########################
  const checkdiscription = (el) => {
    const textElement =
      el.length > MAXLENGTH && showMore ? el.slice(0, MAXLENGTH) + "..." : el;
    setDiscriptionText(textElement);
  };

  return (
    <div className={styles.productPage}>
      {product ? (
        <div className={styles.productImages}>
          <ImagesComp images={product.images} />
          <div className={styles.productDetails}>
            <h1 className={styles.productName}>{product.name.toUpperCase()}</h1>
            <div className={styles.productPrice}>
              {product.isPromoted ? (
                <>
                  <span
                    className={styles.oldPrice}
                    style={{ textDecoration: "line-through" }}
                  >
                    DA {product.price} DZD
                  </span>
                  <span className={styles.newPrice}>
                    DA{" "}
                    {~~(
                      product.price - product.price * (product.discount / 100)
                    )}{" "}
                    DZD
                  </span>
                </>
              ) : (
                <span className={styles.newPrice}>DA {product.price} DZD</span>
              )}
            </div>
            <div className={styles.productDescription}>
              <div className={styles.descText}>
                {discriptionText
                  ? discriptionText
                  : checkdiscription(product.description)}
                {product.description.length > MAXLENGTH && (
                  <span
                    onClick={() => {
                      setShowMore(!showMore);
                      checkdiscription(product.description);
                    }}
                    className={styles.readMore}
                  >
                    {showMore ? " ReadMore" : " ShowLess"}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.productSizes}>
              <h3>Available Sizes:</h3>
              <ul className={styles.sizeList}>
                {product.size.map((size, index) =>
                  size.numberofsize > 0 ? (
                    <button
                      key={index}
                      style={{
                        border:
                          activeSize === size.size ? "1px solid green" : "",
                      }}
                      onClick={() => setActiveSize(size.size)}
                      className={styles.sizeButton}
                    >
                      {size.size}
                    </button>
                  ) : (
                    <button
                      key={index}
                      disabled
                      className={styles.sizeButtonDisabled}
                    >
                      {size.size}
                      <br />
                      (Out of stock)
                    </button>
                  )
                )}
              </ul>
            </div>
            {product.color.length > 0 && (
              <div className={styles.productSizes}>
                <h3>Available Colors:</h3>
                <ul className={styles.sizeList}>
                  {product.color.map((color, index) =>
                    color.numberofcolor > 0 ? (
                      <button
                        key={index}
                        style={{
                          border:
                            activeColor === color.color
                              ? "1px solid green"
                              : "",
                        }}
                        onClick={() => setActiveColor(color.color)}
                        className={styles.sizeButton}
                      >
                        {color.color}
                      </button>
                    ) : (
                      <button
                        key={index}
                        disabled
                        className={styles.sizeButtonDisabled}
                      >
                        {color.color}
                        <br />
                        (Out of stock)
                      </button>
                    )
                  )}
                </ul>
              </div>
            )}
            <div
              className={styles.message}
              style={{
                color: message.includes("successfully") ? "green" : "red",
              }}
            >
              {message}
            </div>
            <button onClick={addingProduct} className={styles.addToCartButton}>
              Add to Cart
            </button>
            <hr />
            <div className={styles.messageToFill}>
              <h3>Or</h3>
            </div>
            <button
              onClick={() => {
                if (!activeSize || !activeColor) {
                  setMessage(
                    "Please select a size and color before adding to cart."
                  );
                  setTimeout(() => {
                    setMessage("");
                  }, 3000);
                  return;
                }
                
                addingProduct();
                router.push("/checkout");
              }}
              className={styles.addToCartButton}
            >
              Buy now
            </button>
            <div className={styles.formillareContainer}>
              <Formillare />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Product;
