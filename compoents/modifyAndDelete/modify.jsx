import React from "react";
import styles from "./modify.module.sass";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../loading/loading";

const Modify = () => {
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        performSearch(query);
      } else {
        setProduct([]);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [query]);
  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API}/api/products/search?q=${searchTerm}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setProduct(response.data.products);
      console.log("Search results:", response.data.products);
    } catch (error) {
      setMessage("product not found")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.modify_section}>
        <div className={styles.search_container}>
          <div className={styles.search_bar}>
            <FaSearch className={styles.search_icon} />
            <input
              type="text"
              value={query}
              placeholder="Search products..."
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className={styles.searchDisplay}>
            {loading ? (
              <div className={styles.loading}>
                <Loading />
              </div>
            ) : product.length > 0 ? (
              product.map((item) => (
                <div key={item._id} className={styles.product_item}>
                  <div className={styles.product_details}>
                    <span
                      style={{
                        fontSize: "44px",
                        fontWeight: "bold",
                        marginRight: "10px",
                      }}
                    >
                      -
                    </span>
                    <img
                      src={item.images[0] || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className={styles.product_image}
                    />
                    <div className={styles.product_info}>
                      <h3>{item.name}</h3>
                      <p>Price: ${item.price}</p>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.edit_button}
                      onClick={() =>
                        alert("Edit functionality not implemented yet")
                      }
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className={styles.delete_button}
                      onClick={() =>
                        alert("delete functionality not implemented yet")
                      }
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.message}>{message}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modify;
