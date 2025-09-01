import React, { useState } from "react";
import styles from "../styles/register.module.sass";
import { useRouter } from "next/router";
import Link from "next/link";
import EyeIcon from "../compoents/icons/EyeIcon";
import axios from "axios";

const Register = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  const validateUsername = (username) => {
    // No capital letters and no spaces
    return /^[a-z0-9]+$/.test(username);
  };

  const validateEmail = (email) => {
    // Must contain @ and end with a valid domain
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Must start with 05, 06, or 07 and be 10 digits
    return /^(05|06|07)\d{8}$/.test(phone);
  };

  const validatePassword = (password) => {
    // At least 8 characters, contains a number, at least one uppercase letter, and no spaces
    return /^(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (username === "" || email === "" || password === "" || phone === "") {
      setError("Please fill all the fields");
      return;
    }

    // Validate username
    if (!validateUsername(username)) {
      setError("Username must be lowercase and contain no spaces");
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone number
    if (!validatePhone(phone)) {
      setError("Phone number is worng");
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long, contain a number, and at least one uppercase letter");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${API}/post/register`, {
        email: email,
        name: username,
        password: password,
        phone: phone,
      });

      // Store the token
      localStorage.setItem("token", response.data.user.token);
      router.push("/");
    } catch (error) {
      setError("Registration failed. Please try again.");
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
          <h1>Register</h1>
          <h2>Create an account</h2>
        </div>
        <form className={styles.form}>
          <label htmlFor="username">Enter your username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toLowerCase());
              setError(null);
            }}
          />
          <label htmlFor="phone">Enter your phone number</label>
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError(null);
            }}
            maxLength={10}
          />
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
              onClick={handleRegister}
              disabled={isLoading}
              className={isLoading ? styles.loading : ""}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <p className={styles.IsLogin}>
          Already have an account?{" "}
          <Link href="/login" className={styles.loginLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
