import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://web-stories-cms-player-5b9q.vercel.app//api/auth/register", {
        name,
        email,
        password,
      });

      alert("Admin Registered Successfully ✅");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900 p-8 rounded-xl w-96 text-white shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-5">Create Admin Account</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 bg-gray-800 rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-gray-800 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded">
          Register Admin
        </button>
      </form>
    </div>
  );
}
