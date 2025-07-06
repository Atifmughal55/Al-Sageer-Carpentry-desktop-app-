import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col items-center justify-center bg-[#fffdf5] px-6 py-10 text-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-[300px] h-[300px] bg-yellow-100 rounded-full blur-3xl opacity-40 top-10 -left-20 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-yellow-200 rounded-full blur-3xl opacity-30 bottom-0 -right-20 animate-pulse delay-500"></div>

      {/* 404 Number */}
      <h1 className="text-[10rem] font-extrabold text-yellow-500 drop-shadow-md z-10">
        404
      </h1>

      {/* Badge */}
      <div className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-semibold rotate-3 shadow z-10">
        Uh-oh! Page Not Found
      </div>

      {/* Message */}
      <p className="mt-6 text-gray-700 text-lg max-w-md z-10">
        Looks like the page you're trying to visit doesn’t exist or has been
        moved.
      </p>

      {/* Go Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-lg shadow transition z-10"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
