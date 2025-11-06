import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/admin"); // ✅ redirect after login
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-xl w-96 text-white"
      >
        <h2 className="text-2xl mb-5 font-semibold">Admin Login</h2>

        <input
          type="email"
          className="w-full p-3 bg-gray-800 mb-4 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 bg-gray-800 mb-4 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 py-3 rounded hover:bg-blue-700">
          Login
        </button>

        <Link
          to="/reset-admin"
          className="mt-3 block text-center text-blue-400 hover:underline text-sm"
        >
          Forgot email or password?
        </Link>
      </form>
    </div>
  );
}
