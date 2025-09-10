import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {ChevronDown, Calendar } from "lucide-react";
import { axiosInstance } from "../../axios";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";


export const CoachCard = ({ coach }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
    <div className="flex items-center gap-3">
      <Calendar className="w-6 h-6 text-teal-500" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{coach.name}</h3>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
        Available
      </span>
      <Link
        to={`/session/${coach._id}`}
        className="px-3 py-1 bg-teal-500 text-white rounded-full text-sm font-medium hover:bg-teal-600 transition-all duration-200"
      >
        Book
      </Link>
    </div>
  </div>
);

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    const params = new URLSearchParams(location.search);

    const fetchCoaches = async () => {
      try {
        const response = await axiosInstance.get("/coach/get-approved-coaches");
        const fetchedCoaches = response.data || [];
        
        setCoaches(fetchedCoaches);
      } catch (err) {
        setError("Failed to fetch coaches. Please try again later.");
        toast.error("Error loading coaches");
        console.error("Coaches fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [location.search]);
 

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          data-aos="fade-up"
          className="relative mb-12 h-[360px] flex items-center justify-center rounded-xl overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
          />
          <div className="absolute inset-0" />
          <div className="relative z-10 text-center px-6 py-10">
            <h1 className="text-4xl md:text-6xl text-teal-600 font-bold tracking-tight">
              Find Your Coach Below
            </h1>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <ChevronDown
              className="w-12 h-12 text-teal-500 animate-bounce"
              strokeWidth={3}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-700 text-center">Loading coaches...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
            <div
              data-aos="fade-up"
              className="bg-white p-6 rounded-xl shadow-md lg:sticky lg:top-20 h-fit border-t-4 border-teal-500"
            >
            
            </div>

            <div data-aos="fade-up" className="lg:col-span-1">
              <div className="mb-6 flex items-center justify-between p-4 bg-teal-500 text-white rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-yellow-400" />
                </div>
                <Link
                  to="/booked-sessions"
                  className="px-4 py-2 bg-white text-teal-500 rounded-lg font-semibold shadow hover:bg-gray-100 transition-all duration-200"
                >
                  Your Sessions
                </Link>
              </div>
             <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Coaches</h2>
              {coaches.length === 0 ? (
                <p className="text-gray-600 text-center">No coaches found.</p>
              ) : (
                <div className="space-y-4">
                  {coaches.map((coach) => (
                    <CoachCard key={coach._id} coach={coach} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div data-aos="fade-up" className="mt-16"></div>
      </div>
    </div>
  );
}