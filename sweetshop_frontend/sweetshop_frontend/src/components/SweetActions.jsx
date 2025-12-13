import API from "../api/api";

export default function SweetActions({ sweet, onRestock, onDelete }) {
  const handleRestock = async () => {
    const quantity = prompt("Enter quantity to restock:");
    if (!quantity) return;
    try {
      await API.post(`sweets/${sweet.id}/restock/`, { quantity });
      onRestock();
    } catch (err) {
      alert(err.response?.data?.error || "Restock failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await API.delete(`sweets/${sweet.id}/`);
      onDelete();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={handleRestock}
        className="flex-1 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
      >
        Restock
      </button>
      <button
        onClick={handleDelete}
        className="flex-1 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Delete
      </button>
    </div>
  );
}
