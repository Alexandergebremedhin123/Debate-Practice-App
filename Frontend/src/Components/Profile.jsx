import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LogOut, MapPin, Calendar } from "lucide-react";
import { axiosInstance } from "../axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("Token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("User") || "{}");
      const id = storedUser.id;

      if (!id) {
        setError("User ID not found. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.get(`user/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setUser(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 
          "An error occurred while fetching your profile. Please try again."
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#008080] mx-auto"></div>
          <p className="mt-3 text-gray-600 text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <p className="text-red-600 text-base mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#008080] text-white px-4 py-2 rounded hover:bg-[#006666] text-sm"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#f5f5f5] flex flex-col items-center py-8 px-4 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg mt-32 p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#008080] transition-transform hover:scale-105"
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {user.name || "User Name"}
            </h1>
            <p className="text-gray-600 flex items-center justify-center sm:justify-start mb-3">
              <Mail size={16} className="mr-2 text-[#008080]" />
              {user.email || "user@example.com"}
            </p>
            <div className="flex justify-center sm:justify-start gap-4">
             
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800 text-sm font-semibold transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              Personal Information
            </h2>
            <div className="space-y-2 text-gray-600 text-sm">
              <p className="flex items-center">
                <Calendar size={16} className="mr-2 text-[#008080]" />
                <span className="font-medium">Age:</span>
                <span className="ml-2">{user.age || "Not specified"}</span>
              </p>
              <p className="flex items-center">
                <MapPin size={16} className="mr-2 text-[#008080]" />
                <span className="font-medium">Address:</span>
                <span className="ml-2">{user.address || "Not specified"}</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              Account Details
            </h2>
            <div className="space-y-2 text-gray-600 text-sm">
              <p>
                <span className="font-medium">Joined:</span>{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user.role || "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;