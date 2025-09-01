import { useState, useEffect } from "react";
import styles from "../styles/checkout.module.sass";
import { useRef } from "react";
import LiversionRapide from "../public/icon/liversionRapide.svg";
import RightIcon from "../public/icon/right.svg";
import axios from "axios";
import DwonIcon from "../public/icon/upOrdwon.svg";
import Link from "next/link";
import { useRouter } from "next/router";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const [requiredInfo, setRequiredInfo] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [vibration, setVibration] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [smallScreenSummary, setSmallScreenSummary] = useState(false);
  const contentRef = useRef(null);
  const router = useRouter();
  const [height, setHeight] = useState("60px");
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [customer, setCostomer] = useState({
    name: "",
    firstName: "",
    city: "",
    address: "",
    numberPhone: "",
    codePostal: "",
  });
  useEffect(() => {
    if (smallScreenSummary && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + "px"); // expand to content
    } else {
      setHeight("60px"); // closed
    }
  }, [smallScreenSummary]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSmallScreen(true);
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
  const [selectWiliya, setSelectWiliya] = useState("Alger");
  const inputRefs = useRef([]);
  const handleArrowKeys = (e, index, type) => {
    const rowLength = 2; // size + qty
    const totalInputs = inputRefs.current.length;

    let targetIndex = index;

    switch (e.key) {
      case "ArrowRight":
        targetIndex = index + 1;
        break;
      case "ArrowLeft":
        targetIndex = index - 1;
        break;
      case "ArrowDown":
        targetIndex = index + rowLength;
        break;
      case "ArrowUp":
        targetIndex = index - rowLength;
        break;
      default:
        return;
    }

    if (inputRefs.current[targetIndex]) {
      inputRefs.current[targetIndex].focus();
    }
  };
  const handelSumbitOrder = async () => {
    if (!cartItems || !selectWiliya) return;
    if (
      !customer.name ||
      !customer.city ||
      !customer.numberPhone ||
      !customer.address
    ) {
      setMessage("Please fill in all required fields.");
      setRequiredInfo(true);
      setVibration(true);
      window.scrollTo({ top: 100, behavior: "smooth" });
      setTimeout(() => {
        setVibration(false);
      }, 3000);
      return;
    }
    cartItems.forEach((e) => {});
    try {
      const res = await axios.post(`${API}/api/newcommend`, {
        data: {
          name: customer.name,
          city: customer.city,
          numberPhone: customer.numberPhone,
          selectWiliya: selectWiliya,
          products: cartItems,
        },
      });
      console.log(res);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      setCostomer({
        name: "",
        firstName: "",
        city: "",
        address: "",
        numberPhone: "",
        codePostal: "",
      });
      router.push("/catalog");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h1>Livraison</h1>
          {smallScreen && (
            <div
              className={styles.DisplayProductForMobile}
              style={{ height }}
              ref={contentRef}
            >
              <div
                className={styles.buttonShowProduct}
                onClick={() => setSmallScreenSummary(!smallScreenSummary)}
              >
                <span>Show order summary</span>
                <DwonIcon
                  className={styles.icon}
                  style={{
                    transform: smallScreenSummary
                      ? "rotate(0deg)"
                      : "rotate(-180deg)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </div>
              <div className={styles.DisplayProduct}>
                {cartItems.map((item, index) => (
                  <>
                    <div key={index} className={styles.cartItem}>
                      <div className={styles.itemDetails}>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          style={{ width: "100px", borderRadius: "10px" }}
                        />
                        <div className={styles.itemInfo}>
                          <h3>{item.product.name}</h3>
                          <p>Size: {item.size}</p>
                          <p>Color: {item.color}</p>
                        </div>
                      </div>
                      <div className={styles.itemPrices}>
                        <div className={styles.itemQuantity}>
                          <span className={styles.firstChild}>
                            {item.quantity}
                          </span>
                        </div>
                        <div className={styles.itemTotal}>
                          <span>{item.product.price} DZD</span>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                <div className={styles.itemTotalPrice}>
                  <h2 style={{ fontSize: "1.5rem" }}>
                    liversion:{" "}
                    {selectWiliya === "Alger"
                      ? 500
                      : selectWiliya === "Blida"
                      ? 600
                      : selectWiliya === "El Taref" ||
                        selectWiliya === "oran" ||
                        selectWiliya === "saida"
                      ? 700
                      : selectWiliya === "Biskra"
                      ? 900
                      : selectWiliya === "Adrar"
                      ? 1500
                      : null}{" "}
                    DZD
                  </h2>
                </div>
                <div className={styles.itemTotalPrice}>
                  <h3
                    style={{
                      fontSize: "1.7rem",
                      fontWeight: "bold",
                      color: "#070738",
                      letterSpacing: "2px",
                    }}
                  >
                    Total:{" "}
                    {cartItems
                      .reduce(
                        (acc, curr) => acc + curr.product.price * curr.quantity,
                        selectWiliya === "Alger"
                          ? 500
                          : selectWiliya === "Blida"
                          ? 600
                          : selectWiliya === "El Taref" ||
                            selectWiliya === "oran" ||
                            selectWiliya === "saida"
                          ? 700
                          : selectWiliya === "Biskra"
                          ? 900
                          : selectWiliya === "Adrar"
                          ? 1500
                          : 0
                      )
                      .toFixed(1)}{" "}
                    DZD
                  </h3>
                </div>
              </div>
            </div>
          )}
          <form className={styles.form}>
            <div className={styles.formGroupTwo}>
              <input
                type="text"
                id="name"
                name="name"
                value={customer.name}
                onChange={(e) => {
                  setCostomer({ ...customer, name: e.target.value });
                }}
                required
                placeholder="name"
                ref={(el) => (inputRefs.current[0] = el)}
                onKeyDown={(e) => handleArrowKeys(e, 0, "name")}
                onFocus={() => {
                  setFocusedInput("name");
                  setMessage("");
                }}
                onBlur={() => setFocusedInput(null)}
                style={{
                  border:
                    focusedInput === "name" || customer.name.length > 0
                      ? "1px solid #e0e0e0"
                      : requiredInfo && "2px red solid",
                }}
              />
              <input
                type="text"
                id="firstName"
                value={customer.firstName}
                onChange={(e) => {
                  setCostomer({ ...customer, firstName: e.target.value });
                }}
                placeholder="First Name (optionnel)"
                ref={(el) => (inputRefs.current[1] = el)}
                onKeyDown={(e) => handleArrowKeys(e, 1, "prenom")}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="address"
                name="address"
                value={customer.address}
                onChange={(e) => {
                  setCostomer({ ...customer, address: e.target.value });
                }}
                required
                placeholder="Adress"
                ref={(el) => (inputRefs.current[2] = el)}
                onKeyDown={(e) => handleArrowKeys(e, 2, "address")}
                onFocus={() => setFocusedInput("address")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  border:
                    focusedInput === "address" || customer.address.length > 0
                      ? "1px solid #e0e0e0"
                      : requiredInfo && "2px red solid",
                }}
              />
            </div>
            <div className={styles.formGroupTwo}>
              <input
                type="text"
                id="codepostal"
                value={customer.codePostal}
                onChange={(e) => {
                  setCostomer({ ...customer, codePostal: e.target.value });
                }}
                placeholder="Code postal (optionnel)"
                ref={(el) => (inputRefs.current[3] = el)}
                onKeyDown={(e) => handleArrowKeys(e, 3, "codepostal")}
              />
              <input
                type="text"
                id="ville"
                placeholder="Ville"
                value={customer.city}
                onChange={(e) => {
                  setCostomer({ ...customer, city: e.target.value });
                }}
                required
                ref={(el) => (inputRefs.current[4] = el)}
                onKeyDown={(e) => handleArrowKeys(e, 4, "phone")}
                onFocus={() => setFocusedInput("ville")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  border:
                    focusedInput === "ville" || customer.city.length > 0
                      ? "1px solid #e0e0e0"
                      : requiredInfo && "2px red solid",
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="Téléphone"
                value={customer.numberPhone}
                onChange={(e) => {
                  setCostomer({ ...customer, numberPhone: e.target.value });
                }}
                maxLength={10}
                accept="number"
                ref={(el) => (inputRefs.current[5] = el)}
                onKeyDown={(e) => handleArrowKeys(e, 5, "phone")}
                onFocus={() => setFocusedInput("phone")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  border:
                    focusedInput === "phone" || customer.numberPhone.length > 0
                      ? "1px solid #e0e0e0"
                      : requiredInfo && "2px red solid",
                }}
              />
            </div>
          </form>
          <div className={styles.LiversionRapide}>
            <h2>Livraison rapide 58 wilaya en 48h</h2>
            <LiversionRapide className={styles.icon} />
          </div>
          <div className={styles.wiliya}>
            <button
              onClick={() => setSelectWiliya("Alger")}
              style={{
                backgroundColor: selectWiliya.startsWith("Alger")
                  ? "#f3fff2ff"
                  : "transparent",
                border: selectWiliya.startsWith("Alger")
                  ? "1px solid #12b800"
                  : "",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <div className={styles.partOne}>
                <div className={styles.slected}>
                  {selectWiliya.startsWith("Alger") && (
                    <div className={styles.cyrcelGreen}></div>
                  )}
                </div>
                <span>Alger</span>
              </div>
              <h4>500,00 DA</h4>
            </button>

            <button
              onClick={() => setSelectWiliya("Blida")}
              style={{
                backgroundColor: selectWiliya.startsWith("Blida")
                  ? "#f3fff2ff"
                  : "transparent",
                border: selectWiliya.startsWith("Blida")
                  ? "1px solid #12b800"
                  : "",
              }}
            >
              <div className={styles.partOne}>
                <div className={styles.slected}>
                  {selectWiliya.startsWith("Blida") && (
                    <div className={styles.cyrcelGreen}></div>
                  )}
                </div>
                <span>Blida - Boumerdès - Tipaza</span>
              </div>
              <h4>600,00 DA</h4>
            </button>

            <button
              onClick={() => setSelectWiliya("El Taref")}
              style={{
                backgroundColor: selectWiliya.startsWith("El Taref")
                  ? "#f3fff2ff"
                  : "transparent",
                border: selectWiliya.startsWith("El Taref")
                  ? "1px solid #12b800"
                  : "",
              }}
            >
              <div className={styles.partOne}>
                <div className={styles.slected}>
                  {selectWiliya.startsWith("El Taref") && (
                    <div className={styles.cyrcelGreen}></div>
                  )}
                </div>
                <span>
                  El Taref - Skikda - Annaba - Béjaïa - Bouira - Constantine -
                  Jijel - Tizi Ouzou - Sétif - Batna - Bordj Bou Arreridj -
                  Guelma
                </span>
              </div>
              <h4>700,00 DA</h4>
            </button>

            <button
              onClick={() => setSelectWiliya("oran")}
              style={{
                backgroundColor: selectWiliya.startsWith("oran")
                  ? "#f3fff2ff"
                  : "transparent",
                border: selectWiliya.startsWith("oran")
                  ? "1px solid #12b800"
                  : "",
              }}
            >
              <div className={styles.partOne}>
                <div className={styles.slected}>
                  {selectWiliya.startsWith("oran") && (
                    <div className={styles.cyrcelGreen}></div>
                  )}
                </div>
                <span>
                  Oran - Mostaganem - Tlemcen - Chlef - Tiaret - Relizane - Sidi
                  Bel Abbès - M'sila - Ain Témouchent - Ain Defla - Mascara -
                  Médéa
                </span>
              </div>
              <h4>700,00 DA</h4>
            </button>

            <button
              onClick={() => setSelectWiliya("saida")}
              style={{
                backgroundColor: selectWiliya.startsWith("saida")
                  ? "#f3fff2ff"
                  : "transparent",
                border: selectWiliya.startsWith("saida")
                  ? "1px solid #12b800"
                  : "",
              }}
            >
              <div className={styles.partOne}>
                <div className={styles.slected}>
                  {selectWiliya.startsWith("saida") && (
                    <div className={styles.cyrcelGreen}></div>
                  )}
                </div>
                <span>
                  Saïda - Souk Ahras - Tissemsilt - Mila - Oum El Bouaghi -
                  Khenchla
                </span>
              </div>
              <h4>700,00 DA</h4>
            </button>

            <button
              onClick={() => setSelectWiliya("Biskra")}
              style={{
                backgroundColor: selectWiliya.startsWith("Biskra")
                  ? "#f3fff2ff"
                  : "transparent",
                border: selectWiliya.startsWith("Biskra")
                  ? "1px solid #12b800"
                  : "",
              }}
            >
              <div className={styles.partOne}>
                <div className={styles.slected}>
                  {selectWiliya.startsWith("Biskra") && (
                    <div className={styles.cyrcelGreen}></div>
                  )}
                </div>
                <span>
                  Biskra - Laghouat - Tébessa - Ghardaïa - Djelfa - Ouargla
                </span>
              </div>
              <h4>900,00 DA</h4>
            </button>

            <button
              onClick={() => setSelectWiliya("Adrar")}
              style={{
                backgroundColor: selectWiliya.startsWith("Adrar")
                  ? "#f3fff2ff"
                  : "transparent",
                border: selectWiliya.startsWith("Adrar")
                  ? "1px solid #12b800"
                  : "",
              }}
            >
              <div className={styles.partOne}>
                <div className={styles.slected}>
                  {selectWiliya.startsWith("Adrar") && (
                    <div className={styles.cyrcelGreen}></div>
                  )}
                </div>
                <span>Adrar - Naàma - Béchar - Tamenrasset</span>
              </div>
              <h4>1500,00 DA</h4>
            </button>
          </div>
          <div className={styles.paymentMethod}>
            <div className={styles.partOne}>
              <RightIcon />
              <h2 style={{ color: "#070738", fontSize: "1.25rem" }}>
                Payment on delivery
              </h2>
            </div>
            <p style={{ color: "darkgray" }}>
              You pay only upon receipt. Simple and secure.
            </p>
          </div>
          <div className={styles.paymentMethodTwo}>
            <h3>Payment on delivery</h3>
          </div>
          <p
            style={{
              color: "red",
              fontSize: "18px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
            }}
          >
            {message}
          </p>
          <div
            className={styles.validation}
            onClick={() => {
              console.log("clicked");
              handelSumbitOrder();
            }}
          >
            <button className={styles.validateButton}>
              confirm the purchase
            </button>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.DisplayProduct}>
            {cartItems.map((item, index) => (
              <>
                <div key={index} className={styles.cartItem}>
                  <div className={styles.itemDetails}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{ width: "100px", borderRadius: "10px" }}
                    />
                    <div className={styles.itemInfo}>
                      <h3>{item.product.name}</h3>
                      <p>Size: {item.size}</p>
                      <p>Color: {item.color}</p>
                    </div>
                  </div>
                  <div className={styles.itemPrices}>
                    <div className={styles.itemQuantity}>
                      <span className={styles.firstChild}>{item.quantity}</span>
                    </div>
                    <div className={styles.itemTotal}>
                      <span>{item.product.price} DZD</span>
                    </div>
                  </div>
                </div>
              </>
            ))}
            <div className={styles.itemTotalPrice}>
              <h3>
                liversion:{" "}
                {selectWiliya === "Alger"
                  ? 500
                  : selectWiliya === "Blida"
                  ? 600
                  : selectWiliya === "El Taref" ||
                    selectWiliya === "oran" ||
                    selectWiliya === "saida"
                  ? 700
                  : selectWiliya === "Biskra"
                  ? 900
                  : selectWiliya === "Adrar"
                  ? 1500
                  : null}{" "}
                DZD
              </h3>
            </div>
            <div className={styles.itemTotalPrice}>
              <h3>
                Total:{" "}
                {cartItems
                  .reduce(
                    (acc, curr) => acc + curr.product.price * curr.quantity,
                    selectWiliya === "Alger"
                      ? 500
                      : selectWiliya === "Blida"
                      ? 600
                      : selectWiliya === "El Taref" ||
                        selectWiliya === "oran" ||
                        selectWiliya === "saida"
                      ? 700
                      : selectWiliya === "Biskra"
                      ? 900
                      : selectWiliya === "Adrar"
                      ? 1500
                      : 0
                  )
                  .toFixed(1)}{" "}
                DZD
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
