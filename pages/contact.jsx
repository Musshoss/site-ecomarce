import React from "react";

const Contect = () => {
  return (
    <div
      style={{
        maxWidth: "80%",
        margin: "40px auto",
        padding: "32px",
        background: "#fff",
        borderRadius: "12px",
        width: "100%",
      }}
    >
      <h1
        style={{ fontSize: "2.5rem", marginBottom: "16px", color: "#070738" }}
      >
        Contact Us
      </h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "24px", color: "#555" }}>
        If you have any questions about our e-commerce site, please reach out
        using the form below or via our contact details.
      </p>
      <form style={{ maxWidth: "500px", margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
              placeholder: "Email",
            }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="message"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "none",
            }}
          ></textarea>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
      <div
        style={{
          paddingTop: "24px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#222" }}>
          Contact Details
        </h2>
        <p style={{ margin: "6px 0", color: "#555" }}>
          Email: mustapha38100@gmail.com
        </p>
        <p style={{ margin: "6px 0", color: "#555" }}>Phone: +213559178432</p>
        <p style={{ margin: "6px 0", color: "#555" }}>
          Address: blida beni tamou
        </p>
      </div>
    </div>
  );
};

export default Contect;
