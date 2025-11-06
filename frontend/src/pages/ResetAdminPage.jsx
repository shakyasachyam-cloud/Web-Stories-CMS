import React, { useState } from "react";
import axios from "axios";

export default function ResetAdminPage() {
  const [secret, setSecret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/reset-admin", {
        secret,
        email,
        password,
      });

      alert("Admin credentials reset successfully ✅");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form className="bg-gray-900 p-6 rounded-xl w-96" onSubmit={handleReset}>
        <h2 className="text-2xl font-semibold mb-4">Reset Admin Access</h2>

        <input
          type="text"
          placeholder="Master Secret Code"
          className="w-full mb-3 p-3 bg-gray-800 rounded"
          onChange={(e) => setSecret(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="New Admin Email"
          className="w-full mb-3 p-3 bg-gray-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 p-3 bg-gray-800 rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 py-3 rounded">Reset</button>
      </form>
    </div>
  );
}
