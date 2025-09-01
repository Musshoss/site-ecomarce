import React from "react";
import styles from "../styles/catalog.module.sass";
import Filter from "../compoents/filter/filter";
import Product from "../compoents/product/product";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import Pagination from "../compoents/pagination/pagination";
import Loading from "../compoents/loading/loading";
import { useRouter } from "next/router";
const Catalog = () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const inputRef = useRef();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [numEnstock, setNumEnStock] = useState(0);
  const [numOutStock, setNumOutStock] = useState(0);
  const [infoPage, setInfoPage] = useState({});
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const sendEmailToServer = (e) => {
    e.preventDefault();
    const valueOfinput = inputRef.current?.value;
    if (!valueOfinput) {
      setError(true);
      return;
    }
    if (valueOfinput.length < 9) {
      setError(true);
      return;
    }
    if (valueOfinput) {
      setSuccess(true);
      inputRef.current.value = "";
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enStock = await axios.get(
          `${API}/api/products/disponiblity`,
          {
            params: {
              enStock: true,
            },
          }
        );
        setNumEnStock(enStock.data.length);
        console.log("Fetched in-stock products:", enStock);
        const outStock = await axios.get(
          `${API}/api/products/disponiblity`,
          {
            params: {
              enStock: false,
            },
          }
        );
        setNumOutStock(outStock.data.length);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    setIsLoading(true);
    const response = async (page) => {
      try {
        const res = await axios.get(`${API}/api/products`, {
          params: {
            page: page,
            limit: 12,
          },
        });
        setProducts(res.data.products);
        setInfoPage(res.data);
        setIsLoading(false);
        window.scrollTo({ top: 280, behavior: "smooth" });
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    response(page);
  }, [page]);
  return (
    <div className={styles.parent}>
      <div className={styles.container}>
        {router.pathname === "/catalog" ? (
          <div className={styles.header}>
            <h1>Catalog</h1>
            <div className={styles.sendEmail}>
              <p>
                Enter your email to follow trends and get exclusive bonuses!
              </p>
              <form
                className={styles.form}
                onSubmit={sendEmailToServer}
                style={{
                  animation: error
                    ? "shake 0.3s cubic-bezier(.36,.07,.19,.97) both"
                    : "none",
                }}
                onAnimationEnd={() => setError(false)}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.input}
                  ref={inputRef}
                  style={{
                    border: error
                      ? "2px solid #C62E2E"
                      : success
                      ? "2px solid #6EC207"
                      : "2px solid #FFF",
                  }}
                  onFocus={() => setError(false)}
                />
                <button type="submit" className={styles.button}>
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className={styles.headerHome}>
            <span></span>
            <h1>products</h1>
            <span></span>
          </div>
        )}
        <div className={styles.product}>
          {router.pathname === "/catalog" && (
            <div className={styles.filter}>
              <Filter
                setProducts={setProducts}
                numEnstock={numEnstock}
                numOutstock={numOutStock}
              />
            </div>
          )}
          {isLoading ? (
            <div
              className={styles.loadingContainer}
              style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loading />
            </div>
          ) : (
            <Product
              products={products}
              style={{ width: router.pathname === "/catalog" ? "80%" : "90%" }}
            />
          )}
        </div>
        <div
          className={styles.pagination}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Pagination
            currentPage={infoPage.currentPage || 1}
            totalPages={infoPage.totalPages || 1}
            maxVisiblePages={4}
            onPageChange={(page) => {
              setPage(page);
              console.log("Page changed to:", page);
            }}
          />
        </div>
      </div>
      <style jsx>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-5px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Catalog;
