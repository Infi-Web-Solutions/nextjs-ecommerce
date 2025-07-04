
"use client";
import { useState } from "react";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm({
      ...form,
      [name]: type === "file" ? files[0] : value,
    });
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
          value={form.name}
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
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Stock Quantity</label>
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
            alt="Current"
            className="mt-2"
            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
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
