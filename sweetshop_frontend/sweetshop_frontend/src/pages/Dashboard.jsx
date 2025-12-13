import { useState, useEffect } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [message, setMessage] = useState("");
  const [newSweet, setNewSweet] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  // Get username from localStorage to determine admin
  const username = localStorage.getItem("username");
  const isAdmin = username === "admin"; 

  // Fetch sweets from backend
  const fetchSweets = async () => {
    try {
      const res = await API.get("sweets/");
      setSweets(res.data);
    } catch (err) {
      setMessage("Failed to fetch sweets");
    }
  };

  // Purchase sweet
  const handlePurchase = async (id) => {
    try {
      const quantity = 1; // default
      const res = await API.post(`sweets/${id}/purchase/`, { quantity });
      setMessage(res.data.message);
      fetchSweets(); // refresh
    } catch (err) {
      setMessage(err.response?.data.error || "Purchase failed");
    }
  };

  // Delete sweet (admin only)
  const handleDelete = async (id) => {
    try {
      await API.delete(`sweets/${id}/`);
      setMessage("Sweet deleted successfully");
      fetchSweets();
    } catch (err) {
      setMessage(err.response?.data.error || "Delete failed");
    }
  };

  // Restock sweet (admin only)
  const handleRestock = async (id) => {
    const quantity = prompt("Enter quantity to restock:");
    if (!quantity) return;
    try {
      const res = await API.post(`sweets/${id}/restock/`, { quantity });
      setMessage(res.data.message);
      fetchSweets();
    } catch (err) {
      setMessage(err.response?.data.error || "Restock failed");
    }
  };

  // Add sweet (admin only)
  const handleAddSweet = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("sweets/", newSweet);
      setMessage("Sweet added successfully");
      setNewSweet({ name: "", category: "", price: "", quantity: "" });
      fetchSweets();
    } catch (err) {
      setMessage(err.response?.data.error || "Add sweet failed");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Sweet Dashboard</h2>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}

      {/* Admin: Add Sweet Form */}
      {isAdmin && (
        <form
          onSubmit={handleAddSweet}
          className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-4 gap-2"
        >
          <input
            type="text"
            placeholder="Name"
            value={newSweet.name}
            onChange={(e) =>
              setNewSweet({ ...newSweet, name: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newSweet.category}
            onChange={(e) =>
              setNewSweet({ ...newSweet, category: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newSweet.price}
            onChange={(e) =>
              setNewSweet({ ...newSweet, price: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newSweet.quantity}
            onChange={(e) =>
              setNewSweet({ ...newSweet, quantity: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="col-span-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Add Sweet
          </button>
        </form>
      )}

      {/* Sweet List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <div
            key={sweet.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{sweet.name}</h3>
            <p className="mb-1">Category: {sweet.category}</p>
            <p className="mb-1">Price: ₹{sweet.price}</p>
            <p className="mb-2">Stock: {sweet.quantity}</p>

            {/* Purchase button (all users) */}
            <button
              onClick={() => handlePurchase(sweet.id)}
              disabled={sweet.quantity === 0}
              className={`w-full py-2 rounded text-white transition mb-2 ${
                sweet.quantity === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
            </button>

            {/* Admin-only actions */}
            {isAdmin && (
              <>
                <button
                  onClick={() => handleRestock(sweet.id)}
                  className="w-full py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white mb-2 transition"
                >
                  Restock
                </button>
                <button
                  onClick={() => handleDelete(sweet.id)}
                  className="w-full py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
