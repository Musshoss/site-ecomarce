import React from "react";
import styles from "./filter.module.sass";
import Updw from "../../public/icon/upOrdwon.svg";
import { useState } from "react";
import { useEffect } from "react";
import Checkbox from "../../compoents/checkbox/checkbox";
import axios from "axios";
import { toggleButtonClasses } from "@mui/material";
import { transform } from "typescript";

const Filter = ({ setProducts, numEnstock, numOutstock }) => {
  const [onStock, setOnStock] = useState(false);
  const [outStock, setOutStock] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const togglehiddenPart = () => {
    setIsHidden(!isHidden);
  };
  const [isHiddenPrice, setIsHiddenPrice] = useState(true);
  const togglehiddenPartPrice = () => {
    setIsHiddenPrice(!isHiddenPrice);
  };

  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const handleSubmit = () => {
    console.log("Selected Range:", { minValue, maxValue });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/products/disponiblity",
          {
            params: {
              enStock: onStock,
              outStock: outStock,
            },
          }
        );
        setProducts(res.data);
        console.log("Filtered products:", res.data);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };
    if (onStock || outStock) {
      fetchData();
    }
  }, [onStock, outStock]);
  const handleOnStockClick = () => {
    if (onStock) {
      setOnStock(false);
    } else {
      setOnStock(true);
      setOutStock(false);
    }
  };

  const handleOutStockClick = () => {
    if (outStock) {
      setOutStock(false);
    } else {
      setOutStock(true);
      setOnStock(false);
    }
  };
  return (
    <div className={styles.filter}>
      <h1>Filter:</h1>
      <div className={styles.filterContainer}>
        <div className={styles.disponibility}>
          <div className={styles.partApparente} onClick={togglehiddenPart}>
            <h1>Disponibilité</h1>
            <Updw
              style={{
                transform: isHidden ? "rotate(-180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </div>
          <div
            className={styles.hiddenPart}
            style={{
              height: isHidden ? "0px" : "60px",
              overflow: "hidden",
              transition: "height 0.3s ease-in-out",
            }}
          >
            <Checkbox
              label={`En stock (${numEnstock})`}
              isChecked={onStock}
              onChange={handleOnStockClick}
            />
            <Checkbox
              label={`out stock (${numOutstock})`}
              isChecked={outStock}
              onChange={handleOutStockClick}
            />
          </div>
        </div>
      </div>
      <div className={styles.filterContainer}>
        {/* <div className={styles.price}>
          <div className={styles.partApparente} onClick={togglehiddenPartPrice}>
            <h1>Prix</h1>
            <Updw
              style={{
                transform: isHiddenPrice ? "rotate(-180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </div>
          <div
            className={styles.hiddenPartPrice}
            style={{
              height: isHiddenPrice ? "0px" : "150px",
              overflow: "hidden",
              transition: "height 0.3s ease-in-out",
            }}
          >
            <p>The highest price is 36,200DA</p>
            <div className={styles.priceRange}>
              <input
                type="number"
                min="0"
                max="36200"
                value={minValue}
                onChange={(e) => setMinValue(Number(e.target.value))}
                placeholder="Min"
              />
              <input
                type="number"
                min="0"
                max="36200"
                value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value))}
                placeholder="Max"
              />
              <button onClick={handleSubmit} className={styles.filtering}>
                Filtering
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Filter;
