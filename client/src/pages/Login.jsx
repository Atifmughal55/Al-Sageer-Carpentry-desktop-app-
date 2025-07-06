import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email || formData.password) {
      navigate("/dashboard");
    }
    // Add your login logic here
  };

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-yellow-50">
      <div className="bg-yellow-100 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-900">
          Al Sageer Carpentry Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-yellow-800 mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-yellow-800 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 pr-10"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <span
                onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-yellow-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-800 hover:bg-yellow-700 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
