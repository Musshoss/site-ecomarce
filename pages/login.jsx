import React, { useState } from "react";
import styles from "../styles/login.module.sass";
import { useRouter } from "next/router";
import Link from "next/link";
import EyeIcon from "../compoents/icons/EyeIcon";
import axios from "axios";

const Login = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (email === "" || password === "") {
      setError("Please fill all the fields");
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setError("Password worng");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${API}/post/login`, {
        email: email,
        password: password,
      });
      console.log(response);

      // Handle successful login
      // You might want to store the token in localStorage or cookies
      localStorage.setItem("token", response.data.user.token);
      router.push("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </button>
          <h1>Login</h1>
          <h2>Welcome back</h2>
        </div>

        <form className={styles.form}>
          <label htmlFor="email">Enter your email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
          <label htmlFor="password">Enter your password</label>
          <div className={styles.passwordsection}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              minLength={8}
              className={styles.passwordInput}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={togglePasswordVisibility}
            >
              <EyeIcon show={showPassword} />
            </button>
          </div>
          <div className={styles.sumbitSection}>
            <button
              type="submit"
              onClick={handleLogin}
              disabled={isLoading}
              className={isLoading ? styles.loading : ""}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <p className={styles.IsRegister}>
          Don't have an account?{" "}
          <Link href="/register" className={styles.registerLink}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
