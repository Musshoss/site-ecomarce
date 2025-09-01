import React, { useState, useEffect, use, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import styles from "../styles/addproduct.module.sass";
import Loading from "../compoents/loading/loading";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCloudUploadAlt,
} from "react-icons/fa";
import axios from "axios";
import Modify from "../compoents/modifyAndDelete/modify";

const AddProduct = () => {
  const inputRefs = useRef([]);
  const API = process.env.NEXT_PUBLIC_API_URL;
  // ___________________________handle arrow keys ___________________________
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
  const handleAddColor = () => {
    if (!currentColor || !currentQtyOfColor || currentQtyOfColor < 0) return;

    setFormData((prev) => ({
      ...prev,
      color: [
        ...prev.color,
        {
          color: currentColor.trim().toUpperCase(),
          numberofcolor: Number(currentQtyOfColor),
        },
      ],
    }));
    setCurrentColor("");
    setCurrentQtyOfColor("");
  };

  const handleAddSize = () => {
    if (!currentSize || !currentQty || currentQty < 0) return;

    setFormData((prev) => ({
      ...prev,
      size: [
        ...prev.size,
        {
          size: currentSize.trim().toUpperCase(),
          numberofsize: Number(currentQty),
        },
      ],
    }));
    setCurrentSize("");
    setCurrentQty("");
  };
  // ___________________________state for add product ___________________________
  const [activeTab, setActiveTab] = useState("add");
  const [error, setError] = useState("");
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [messages, setMessages] = useState("");
  const [currentSize, setCurrentSize] = useState("");
  const [currentQty, setCurrentQty] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [currentQtyOfColor, setCurrentQtyOfColor] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    isPromoted: false,
    discount: "",
    quantity: "",
    size: [],
    color: [],
    images: [],
    filename: [],
  });
  const onDrop = useCallback((acceptedFiles) => {
    const files = acceptedFiles;
    handleImageUpload(files);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });
  // ___________________________handle image upload ___________________________
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target ? e.target.files : e);
    if (files.length > 10) {
      setError("Please upload a maximum of 10 images");
      setTimeout(() => {
        setError("");
      }, 4000);
      return;
    }
    const formData2 = new FormData();
    files.forEach((file) => {
      formData2.append("image", file);
    });
    setLoadingVisible(true);
    try {
      const response = await axios.post(`${API}/api/upload`, formData2, {
        headers: {
          authorization: `${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setMessages(response.data.message || "Images uploaded successfully");
        setTimeout(() => {
          setMessages("");
        }, 4000);
        const imageUrls = response.data.files.map((file) => file.path);
        const filename = response.data.files.map((file) => file.filename);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...imageUrls],
          filename: [...prev.filename, ...filename],
        }));
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
      setTimeout(() => {
        setError("");
      }, 4000);
    } finally {
      setLoadingVisible(false);
    }
  };
  // ___________________________handle image upload ___________________________
  // ___________________________handle image delete ___________________________
  const deleteImages = async (index, e) => {
    e?.preventDefault();
    setLoadingVisible(true);
    try {
      const response = await axios.delete(`${API}/api/delete/`, {
        data: { filename: formData.filename[index] },
        headers: {
          authorization: `${localStorage.getItem("token")}`,
        },
      });

      setMessages("Image deleted successfully");
      setTimeout(() => {
        setMessages("");
      }, 2000);
    } catch (error) {
      setMessages("");
      setError(error.response?.data?.message || "An error occurred");
      setTimeout(() => {
        setError("");
      }, 4000);
      return;
    } finally {
      setLoadingVisible(false);
    }
    setFormData((prev) => {
      const newImages = [...prev.images];
      const newFilenames = [...prev.filename];
      newImages.splice(index, 1);
      newFilenames.splice(index, 1);
      return { ...prev, images: newImages, filename: newFilenames };
    });
  };
  //___________________________handle all image delete when window loading_______________________________
  useEffect(() => {
    const handleBeforeUnload = () => {
      formData.images.forEach(async (_, index) => {
        await deleteImages(index);
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData.images]);
  //___________________________handle all image delete when window loading________________________________
  // ___________________________handle image delete ___________________________

  // ___________________________handle submit ___________________________
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    if (
      formData.name === "" ||
      formData.price === "" ||
      formData.type === "" ||
      formData.images.length === 0 ||
      formData.description === "" ||
      formData.quantity === ""
    ) {
      setError("Please fill all the fields");
      setTimeout(() => {
        setError("");
      }, 4000);
      return;
    }
    const totalQty = formData.size.reduce(
      (sum, item) => sum + (item.numberofsize || 0),
      0
    );
    const totalQtyOfColor = formData.color.reduce(
      (sum, item) => sum + (item.numberofcolor || 0),
      0
    );
    if (totalQty != formData.quantity || totalQtyOfColor != formData.quantity) {
      setError(
        "The total quantity of sizes does not match the product quantity"
      );
      setTimeout(() => {
        setError("");
      }, 4000);
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/addProducts`,
        formData,
        {
          headers: {
            authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response:", response);
      if (response.data.success === true) {
        setMessages("Product added successfully");
        setTimeout(() => {
          setMessages("");
        }, 4000);
      }

      setFormData({
        name: "",
        type: "",
        price: "",
        description: "",
        isPromoted: false,
        discount: "",
        quantity: "",
        size: [],
        color: [],
        images: [],
        filename: [],
      });
      setCurrentSize("");
      setCurrentQty("");
    } catch (err) {
      console.log("Error adding product:", err);
      setError(err.response?.data?.message || "An error occurred");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };
  // ___________________________handle submit ___________________________
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {/*________________________select the active tabs________________________*/}
        <button
          className={`${styles.tab} ${
            activeTab === "add" ? styles.active : ""
          }`}
          onClick={() => {
            setActiveTab("add");
            setFormData({
              name: "",
              type: "",
              price: "",
              description: "",
              isPromoted: false,
              discount: "",
              quantity: "",
              size: [],
              color: [],
              images: [],
              filename: [],
            });
          }}
        >
          <FaPlus /> Add Product
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "modify" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("modify")}
        >
          <FaEdit /> Modify or Delete Product
        </button>
      </div>
      {/*________________________select the active tabs________________________*/}

      <div className={styles.content}>
        {/*________________________add prod</div>uct________________________*/}
        {activeTab === "add" && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.form_group}>
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="type">Product type</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="Enter product type"
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                min={0}
                placeholder="Enter price"
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="description">Description</label>
              <textarea
                style={{ resize: "none" }}
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            <div className={styles.form_group}>
              <label className={styles.checkbox_label}>
                <input
                  type="checkbox"
                  name="isPromo"
                  checked={formData.isPromoted}
                  onChange={(e) =>
                    setFormData({ ...formData, isPromoted: e.target.checked })
                  }
                />
                Has Promotion
              </label>
            </div>

            {formData.isPromoted && (
              <div className={styles.form_group}>
                <label htmlFor="discount">pourcentage of discount (%)</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  placeholder="Enter pourcentage of discount (optional)"
                  max={100}
                  min={0}
                />
              </div>
            )}
            <div className={styles.form_group}>
              <label htmlFor="quantity">quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder="Enter product quantity"
              />
            </div>

            <div className={styles.form_group}>
              <label>Add Size & Quantity</label>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <input
                  type="text"
                  placeholder="Enter Size..."
                  ref={(el) => (inputRefs.current[0] = el)}
                  onKeyDown={(e) => {
                    handleArrowKeys(e, 0);
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSize();
                    }
                  }}
                  value={currentSize}
                  onChange={(e) => setCurrentSize(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter Quantity..."
                  ref={(el) => (inputRefs.current[1] = el)}
                  onKeyDown={(e) => {
                    handleArrowKeys(e, 1);
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSize();
                    }
                  }}
                  min="0"
                  value={currentQty}
                  onChange={(e) => setCurrentQty(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.add_button}
                  onClick={() => {
                    handleAddSize();
                  }}
                >
                  Add
                </button>
              </div>

              <div className={styles.size_preview}>
                {formData.size.map((item, index) => (
                  <div key={index} className={styles.size_chip}>
                    <div className={styles.size_info}>
                      <span className={styles.size_label}>
                        Size ( {index + 1} ) :
                      </span>
                      <span>{item.size}</span>
                      <span>Qty: {item.numberofsize}</span>
                    </div>
                    <button
                      className={styles.remove_button}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          size: prev.size.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.form_group}>
              <label>Add Color & Quantity</label>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <input
                  type="text"
                  placeholder="Enter color..."
                  ref={(el) => (inputRefs.current[2] = el)}
                  onKeyDown={(e) => {
                    handleArrowKeys(e, 2);
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColor();
                    }
                  }}
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter Quantity..."
                  ref={(el) => (inputRefs.current[3] = el)}
                  onKeyDown={(e) => {
                    handleArrowKeys(e, 3);
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColor();
                    }
                  }}
                  min="0"
                  value={currentQtyOfColor}
                  onChange={(e) => setCurrentQtyOfColor(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.add_button}
                  onClick={() => handleAddColor()}
                >
                  Add
                </button>
              </div>

              <div className={styles.size_preview}>
                {formData.color.map((item, index) => (
                  <div key={index} className={styles.size_chip}>
                    <div className={styles.size_info}>
                      <span className={styles.size_label}>
                        color ( {index + 1} ) :
                      </span>
                      <span>{item.color}</span>
                      <span>Qty: {item.numberofcolor}</span>
                    </div>
                    <button
                      className={styles.remove_button}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          color: prev.color.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="images">Product Images</label>
              <div className={styles.upload_container} {...getRootProps()}>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className={styles.hidden_input}
                />
                <label htmlFor="images" className={styles.upload_button}>
                  <FaCloudUploadAlt className={styles.upload_icon} />
                  <span>Choose Images</span>
                </label>
                <p>
                  {isDragActive
                    ? "Drop the files here"
                    : "Drag and drop your files here or click to upload"}
                </p>
              </div>
              <div className={styles.image_preview}>
                {formData.images.map((image, index) => (
                  <div key={index} className={styles.preview_item}>
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      className={styles.remove_image}
                      onClick={(e) => deleteImages(index, e)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/*________________________error message________________________*/}
            {error && (
              <p className={styles.error_message}>{error || massages}</p>
            )}
            {/*________________________error message________________________*/}
            {/*________________________loading message________________________*/}
            {loadingVisible && (
              <div className={styles.loadingVisible}>
                <Loading />
              </div>
            )}
            {/*________________________loading message________________________*/}
            <button
              type="submit"
              className={styles.submit_button}
              onClick={handleSubmit}
            >
              Add Product
            </button>
          </form>
        )}
        {/*________________________modify product________________________*/}
        {activeTab === "modify" && <Modify />}

        {/*________________________delete  product ________________________*/}
      </div>
    </div>
  );
};

export default AddProduct;
