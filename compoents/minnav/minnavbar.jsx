import React from "react";
import styles from "./minnav.module.sass";

const Minnavbar = () => {
  return (
    <div className={styles.parent}>
      <div className={styles.minnavbar}>
        <div className={styles.marquee}>
          <div className={styles.marquee_content}>
            <span>
              discount -20% &nbsp; WELCOME! &nbsp; SITEWIDE SALE &nbsp; discount -20% &nbsp;
              WELCOME! &nbsp; SITEWIDE SALE &nbsp;
            </span>
            <span>
              discount -20% &nbsp; WELCOME! &nbsp; SITEWIDE SALE &nbsp; discount -20% &nbsp;
              WELCOME! &nbsp; SITEWIDE SALE &nbsp;
            </span>
            <span>
              discount -20% &nbsp; WELCOME! &nbsp; SITEWIDE SALE &nbsp; discount -20% &nbsp;
              WELCOME! &nbsp; SITEWIDE SALE &nbsp;
            </span>
            <span>
              discount -20% &nbsp; WELCOME! &nbsp; SITEWIDE SALE &nbsp; discount -20% &nbsp;
              WELCOME! &nbsp; SITEWIDE SALE &nbsp;
            </span>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minnavbar;
