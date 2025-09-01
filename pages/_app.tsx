import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Minnavbar from "../compoents/minnav/minnavbar";
import React from "react";
import Navbar from "../compoents/navbar/navbar";
import { useRouter } from "next/router";
import { Philosopher } from 'next/font/google';
import { useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import Footer from "../compoents/footer/footer"

const philosopher = Philosopher({
  subsets: ['latin'],
  variable: '--font-philosopher',
  display: 'swap',
  weight: ['400', '700'], // Add the required weight property
});


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [smallScreen, setSmallScreen] = React.useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
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
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios({
            method: 'get',
            url: `${API}:5000/post/user`,
            headers: {
              Authorization: `${token}`,
            },
          })
          if (response.status === 400) {
            localStorage.removeItem("token");
            router.push("/login");
          }
          localStorage.setItem("token", response.data.token);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserPosts();
  }, [router.pathname, API, router]);

  return (
    <main className={philosopher.className}>
      <Head>
        <title>Muss</title>
      </Head>
      {router.pathname === "/register" || router.pathname === "/login" ? <></> : router.pathname === "/checkout" ? <Navbar/> : 
      <>
      <Minnavbar/>
      <Navbar /> 
      </>}
      <div style={{marginTop: router.pathname === "/register" || router.pathname === "/login" && smallScreen ? "0px" : router.pathname === "/checkout" ? "60px" : "160px"}}>
        <Component {...pageProps}  />
      </div>
      <Footer />
    </main>
  );
}
