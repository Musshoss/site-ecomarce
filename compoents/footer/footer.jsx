import React from "react";
import styles from "./footer.module.sass";
import Link from "next/link";
import FacebookIcon from "../../public/icon/facebook.svg";
import InstagramIcon from "../../public/icon/instagram.svg";

const Footer = () => {
  return (
    <>
    <div className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.footer}>
          <div className={styles.footer_links}>
            <Link href="/exchangepolicy" className={styles.link}>
              Exchange Policy
            </Link>
            <Link href="/contact" className={styles.link}>
              Contact
            </Link>
            <Link href="/livraison" className={styles.link}>
              Liversion
            </Link>
          </div>
          <div className={styles.footer_social}>
            <Link href="https://www.facebook.com" className={styles.social_link}>
            <FacebookIcon />
            </Link>
            <Link href="https://www.instagram.com" className={styles.social_link}>
            <InstagramIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.footer_text_container}>
        <div className={styles.footertextContainer}>
            <p className={styles.footer_text}>
              © 2023,  
              </p>
            <Link href="/" className={styles.footer_logo}>
                Muss
            </Link>
        </div>
    </div>
    </>
  );
};

export default Footer;
