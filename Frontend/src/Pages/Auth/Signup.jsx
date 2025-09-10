import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";
import { axiosInstance } from "../../axios";
import imageCompression from "browser-image-compression";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate=useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        if (compressedFile.size > 1 * 1024 * 1024) {
          toast.error("Compressed image size should be less than 1MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          setFormData((prev) => ({ ...prev, image: imageUrl }));
          setImagePreview(imageUrl);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          toast.error("Error loading image");
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("Error processing image");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      localStorage.setItem("User",JSON.stringify(response.data.debator));
      localStorage.setItem("Token",response.data.token)
      toast.success(response.data.message || "Signup successful!");
      navigate('/')

      setFormData({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        address: "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-aos="zoom-in-up"
      className="min-h-screen flex flex-col items-center p-4"
    >
      <div className="relative w-full h-80">
       
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-opacity-50 p-4">
        <h2 className="text-5xl font-bold text-teal-500">Create Your Free Account</h2>
          <h1 className="text-5xl text-teal-500 py-3 font-bold mb-2">Sign Up Now</h1>
          <p className="text-center text-lg font-bold text-teal-500 max-w-md">
            Find Your Best Coaches.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl w-full max-w-2xl shadow-lg mt-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter your full name"
              className="border-2 border-[#007E85] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007E85]"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              className="border-2 border-[#007E85] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007E85]"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              className="border-2 border-[#007E85] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007E85]"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              placeholder="Enter your age"
              className="border-2 border-[#007E85] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007E85]"
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              className="border-2 border-[#007E85] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007E85]"
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Profile Picture</label>
            <div className="relative">
              <input
                type="file"
                name="image"
                accept="image/*"
                className="border-2 border-[#007E85] p-2 rounded-md w-full file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#007E85] file:text-white hover:file:bg-teal-700"
                onChange={handleImage}
              />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview }
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-full border-2 border-[#007E85]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, image: null });
                    setImagePreview(null);
                  }}
                  className="mt-2 text-sm text-red-500 hover:text-red-700"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-2 font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            placeholder="Enter your address"
            className="border-2 border-[#007E85] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007E85]"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-[#007E85] text-white px-4 py-2 rounded-md w-full hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
              Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="mt-4 text-gray-700">
        Already have an account?{" "}
        <a href="/login" className="text-[#007E85] font-bold hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default Signup;