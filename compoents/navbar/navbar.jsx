import React from "react";
import styles from "./navbar.module.sass";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import Cartshopping from "../../public/icon/cartshopping.svg";
import UserIConPlus from "../../public/icon/userIconPlus.svg";
import UserIcon from "../../public/icon/userIcon.svg";
import LogoutIcon from "../../public/icon/logout.svg";
import MenuIcon from "../../public/icon/menu.svg";
import HomeIcon from "../../public/icon/home.svg";
import CatalogIcon from "../../public/icon/catalog.svg";
import ContactIcon from "../../public/icon/contact.svg";
import axios from "axios";

const Navbar = () => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const pagesNotShown = [
    "/login",
    "/register",
    "/checkout",
    "/cart",
    "/contact",
    "/livraison",
    "/catalog",
    "/",
  ];
  const router = useRouter();
  const [smallScreen, setSmallScreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [numInCart, setNumInCart] = useState(null);
  const [modaleCart, setModaleCart] = useState(false);
  const [theLastProduct, setTheLastProduct] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [widthScreen, setWidthScreen] = useState(0);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  useEffect(() => {
    const handleStorageChange = async () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setNumInCart(cart.length);
      const product_id = cart[cart.length - 1]?.product_id;
      if (!product_id) {
        setModaleCart(false);
        return;
      }
      try {
        const response = await axios.get(`${API}/api/product/${product_id}`);
        setTheLastProduct({
          ...cart[cart.length - 1],
          product: response.data,
        });
        console.log("Last product fetched:", theLastProduct);
      } catch (error) {
        console.error("Error fetching last product:", error);
      }

      if (cart.length > 0 && !pagesNotShown.includes(router.pathname)) {
        setModaleCart(true);
      } else {
        setModaleCart(false);
      }
    };

    handleStorageChange();
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };
  const handleUserClick = () => {
    console.log("clicked");
    if (!isLoggedIn) {
      router.push("/register");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  // CHEKK IF THE SCREEN IS 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSmallScreen(true);
        setWidthScreen(window.innerWidth);
      } else {
        setSmallScreen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={styles.navbar}
      style={{ top: router.pathname === "/checkout" ? "0" : "40px" }}
    >
      <div className={styles.navbar_container}>
        {smallScreen && (
          <div>
            <button className={styles.MenuIcon} onClick={() => toggleMenu()}>
              <MenuIcon />
            </button>
          </div>
        )}
        <div className={styles.logo}>
          <Link href="/" className={styles.logo_link}>
            <h1>Muss</h1>
          </Link>
        </div>
        {!smallScreen && (
          <div
            className={styles.pages}
            style={{
              display: router.pathname === "/checkout" ? "none" : "flex",
            }}
          >
            <Link
              href="/"
              className={`${styles.page_link} ${
                router.pathname === "/" ? styles.active : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className={`${styles.page_link} ${
                router.pathname === "/catalog" ? styles.active : ""
              }`}
            >
              Catalog
            </Link>
            <Link
              href="/contact"
              className={`${styles.page_link} ${
                router.pathname === "/contact" ? styles.active : ""
              }`}
            >
              Contact
            </Link>
          </div>
        )}
        {showMenu && (
          <div
            className={styles.menu}
            onClick={() => {
              setShowMenu(false);
            }}
            style={{ top: router.pathname === "/checkout" ? "120px" : "160px" }}
          >
            <div
              className={styles.mobileMenu}
              style={{
                width: `${widthScreen / 2}px`,
                overflow: "hidden",
                transition: "width 0.3s ease",
              }}
            >
              <Link
                href="/"
                className={`${styles.page_link} ${
                  router.pathname === "/" ? styles.active : ""
                }`}
                onClick={() => toggleMenu()}
              >
                <HomeIcon />
                Home
              </Link>
              <Link
                href="/catalog"
                className={`${styles.page_link} ${
                  router.pathname === "/catalog" ? styles.active : ""
                }`}
                onClick={() => toggleMenu()}
              >
                <CatalogIcon />
                Catalog
              </Link>
              <Link
                href="/contact"
                className={`${styles.page_link} ${
                  router.pathname === "/contact" ? styles.active : ""
                }`}
                onClick={() => toggleMenu()}
              >
                <ContactIcon />
                Contact
              </Link>
            </div>
            <div className={styles.BottomMenu}></div>
          </div>
        )}
        <div className={styles.icon_button}>
          <div className={styles.button}>
            <Cartshopping
              onClick={() => {
                router.push("/cart");
              }}
            />
            {numInCart > 0 && (
              <span className={styles.numInCart}>{numInCart}</span>
            )}

            {!smallScreen && (
              <div
                className={styles.cartTooltip}
                style={{
                  transform: !modaleCart
                    ? "translate(-50%, -200%)"
                    : "translate(-50%, 0)",
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                {modaleCart && (
                  <>
                    <div className={styles.cartTooltipContent}>
                      <h3>✓ Item added to cart</h3>
                      <span
                        onClick={() => {
                          setModaleCart(false);
                        }}
                      >
                        &#10005;
                      </span>
                    </div>
                    <div className={styles.cartTooltipProduct}>
                      <img
                        src={theLastProduct.product.images[0]}
                        alt={theLastProduct.product.name}
                        className={styles.cartTooltipImage}
                      />
                      <div className={styles.cartTooltipDetails}>
                        <h4>{theLastProduct.product.name}</h4>
                        <p>Price: {theLastProduct.product.price} DZD</p>
                        <p>Size: {theLastProduct.size}</p>
                        <p>Color: {theLastProduct.color}</p>
                      </div>
                    </div>
                    <div className={styles.cartTooltipActions}>
                      <Link
                        href="/cart"
                        className={styles.viewCartButton}
                        onClick={() => setModaleCart(false)}
                      >
                        View Cart
                      </Link>
                      <p>or</p>
                      <Link
                        href="/checkout"
                        className={styles.viewCheckoutButton}
                        onClick={() => setModaleCart(false)}
                      >
                        Proceed to purchase
                      </Link>
                      <button
                        className={styles.closeButton}
                        onClick={() => setModaleCart(false)}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <button className={styles.button} onClick={handleUserClick}>
            {isLoggedIn ? <UserIcon /> : <UserIConPlus />}
          </button>
          <button className={styles.button} onClick={handleLogout}>
            {isLoggedIn ? <LogoutIcon /> : null}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
