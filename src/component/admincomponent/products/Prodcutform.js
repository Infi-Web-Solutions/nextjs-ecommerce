"use client";
import { useState } from "react";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    name: {
      en: initialData?.name?.en || "",
    },
    description: {
      en: initialData?.description?.en || "",
    },
    price: "",
    stock: "",
    category: "",
    image: null,
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Handle nested fields for name.en and description.en
    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: { ...prev.name, en: value },
      }));
    } else if (name === "description") {
      setForm((prev) => ({
        ...prev,
        description: { ...prev.description, en: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "file" ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) return onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
           value={form.name.en}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-12">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={form.description.en}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Stock</label>
        <input
          type="number"
          className="form-control"
          name="stock"
          value={form.stock}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Category</label>
        <input
          type="text"
          className="form-control"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Product Image</label>
        <input
          type="file"
          className="form-control"
          name="image"
          onChange={handleChange}
        />
        {initialData?.image && (
          <img
            src={`/uploads/${initialData.image}`}
            alt="Product"
            className="mt-2"
            style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
          />
        )}
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-primary">
          {initialData?._id ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
}
