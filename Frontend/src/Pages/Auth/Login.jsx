import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Mail, Lock, Loader2 } from "lucide-react";
import { axiosInstance } from "../../axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      toast.success(response.data.message);
      localStorage.setItem("User", JSON.stringify(response.data.debator));
      localStorage.setItem("Token", response.data.token);
       const role = response.data.debator.role;
      if (role === "admin") {
        navigate("/*");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-aos='fade-up'  className="flex h-screen w-full max-w-full overflow-x-hidden items-center justify-center">
      
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8">
        <h1 className="text-3xl sm:text-4xl text-[#007E85] font-bold mb-4">
          WELCOME BACK
        </h1>
        <p className="mb-6 text-sm sm:text-base text-gray-500">
          Welcome back! Please enter your details.
        </p>
        
        {error && (
          <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
        )}

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="flex items-center border-2 border-[#007E85] rounded-md p-3 mb-4">
            <Mail className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full focus:outline-none text-base sm:text-lg"
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 rounded-md p-3 mb-4">
            <Lock className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full focus:outline-none text-base sm:text-lg"
              required
            />
          </div>

          
          <button 
            type="submit"
            className="w-full px-6 sm:px-8 py-3 bg-[#007E85] text-white rounded-full text-base sm:text-lg font-bold shadow-xl hover:bg-[#006669] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#007E85] disabled:bg-gray-400 cursor-pointer"
            disabled={loading}
            aria-label="Sign in"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        
        <p className="mt-6 text-sm sm:text-base">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#007E85] hover:bg-[#007E85] hover:text-white px-3 py-1 rounded-full font-semibold transition-all duration-300"
          >
            Sign up for free!
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Login;