import React from "react";
import { Link } from "react-router-dom";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Header = ({ user }) => {
  const greeting = getGreeting();

  return (
    <header className="bg-yellow-900 text-yellow-100 p-4 shadow-md print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Greeting */}
        <div className="flex-1 text-yellow-300 font-medium">
          {user ? (
            <span>
              {greeting}, <strong>{user.name}</strong>!
            </span>
          ) : (
            <span>{greeting}, Guest!</span>
          )}
        </div>

        {/* Center: Shop Name */}
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold tracking-wide font-serif">
            Al Sageer Carpentry
          </h1>
        </div>

        {/* Right: Login button or User Name */}
        <div className="flex-1 flex justify-end">
          {user ? (
            <div className="text-yellow-300 font-semibold">{user.name}</div>
          ) : (
            ""
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
