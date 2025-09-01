import React, { useEffect } from "react";
import styles from "../styles/home.module.sass";
import homeImage from "../public/img/homeimages.jpg";
import { useRouter } from "next/router";
import Catalog from "./catalog"
export default function Home() {
  const router = useRouter();
  return (
    <main>
      <div className={styles.interface}>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${homeImage.src})` }}
        ></div>
        <div className={styles.content}>
          <h1>Welcome to our website</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
          <button onClick={() => router.push("/catalog")}>Shop Now</button>
        </div>
      </div>
      <Catalog />
    </main>
  );
}
