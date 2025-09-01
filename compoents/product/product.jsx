import React from "react";
import styles from "./product.module.sass";

const Product = ({ products }) => {
  console.log("Products received:", products.reverse());
  return (
    <div className={styles.productsGrid}>
      {products.map((product, index) => (
        <div
          className={styles.productCard}
          key={index}
          onClick={() => (window.location.href = `/product/${product._id}`)}
        >
          <div className={styles.imageWrap}>
            <img src={product.images[0]} alt={product.name} />
            {product.isPromoted && product.quantity !== 0 && (
              <span className={styles.promoBadge}>Promo</span>
            )}
            {product.quantity === 0 && (
              <span className={styles.outOfStockBadge}>Out of Stock</span>
            )}
          </div>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.priceRow}>
            {product.isPromoted ? (
              <>
                <span className={styles.oldPrice}>DA {product.price} DZD</span>
                <span className={styles.newPrice}>
                  DA{" "}
                  {Math.trunc(
                    product.price - product.price * (product.discount / 100)
                  )}{" "}
                  DZD
                </span>
              </>
            ) : (
              <span className={styles.newPrice}>DA {product.price} DZD</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Product;
