import { useState } from "react";
import API from "../api/api";

export default function AddSweet({ onSweetAdded }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("sweets/", { name, category, price, quantity });
      onSweetAdded();
      setName(""); setCategory(""); setPrice(""); setQuantity("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add sweet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-xl font-semibold mb-2">Add New Sweet</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
      />
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add Sweet
      </button>
    </form>
  );
}
