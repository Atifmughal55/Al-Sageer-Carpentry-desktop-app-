import React, { useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetFields, setShowResetFields] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      return toast.error("Please enter a valid email");
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: { email },
      });

      if (response.data.success) {
        setRecoveryCode(response.data.recoveryCode);
        setShowResetFields(true);
        toast.success("Recovery code sent to your email");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Please enter correct email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword)
      return toast.error("Please fill in all password fields");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords does not match");

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.recoverPassword,
        data: {
          email,
          newPassword,
          recoveryCode,
        },
      });

      console.log("Response: ", response);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-amber-300 rounded-lg shadow-lg bg-amber-100 space-y-6">
      <h2 className="text-3xl font-bold text-center text-amber-700">
        Forgot Password
      </h2>

      {!showResetFields ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <label className="block text-amber-800 font-medium">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-amber-400 focus:border-amber-500 focus:ring-amber-400 focus:outline-none px-4 py-2 rounded-md bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Recovery Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <label className="block text-amber-800 font-medium">
            Recovery Code
          </label>
          <input
            type="text"
            value={recoveryCode}
            readOnly
            className="w-full border border-amber-300 px-4 py-2 rounded-md bg-amber-50 text-amber-700 font-semibold"
          />

          <label className="block text-amber-800 font-medium">
            New Password
          </label>
          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-amber-400 focus:border-amber-500 focus:ring-amber-400 focus:outline-none px-4 py-2 rounded-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className="block text-amber-800 font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-amber-400 focus:border-amber-500 focus:ring-amber-400 focus:outline-none px-4 py-2 rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
