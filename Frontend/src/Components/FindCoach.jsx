import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { axiosInstance } from '../axios';
import { toast } from 'react-hot-toast';
import { Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FindCoach = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [available, setAvailable] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out' });
  }, []);

  useEffect(() => {
    if (!name ) {
      setCoaches([]);
    }
  }, [name]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.get('/coach/find-coaches', {
        params: { name, available: available ? 'true' : 'false' },
      });
      setCoaches(response.data.coaches);
      if (response.data.coaches.length === 0) {
        toast('No coaches found matching your criteria.');
      }
    } catch (error) {
      toast.error('Failed to fetch coaches. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div
          data-aos="fade-up"
          className="bg-gray-50 p-8 rounded-3xl shadow-lg max-w-5xl mx-auto my-12 border border-gray-100"
        >
          <h2 className="text-4xl font-bold text-teal-700 mb-6 text-center bg-clip-text">
            Find Your Coach
          </h2>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Coaches' Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 focus:outline-none transition-all duration-300 bg-gray-50 text-gray-700 placeholder-black"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="relative cursor-pointer bg-teal-700 font-bold text-white px-8 py-3 rounded-xl shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 disabled:bg-teal-300 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  ></path>
                </svg>
              ) : (
                'Search'
              )}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center"></div>
        </div>

        {coaches.length > 0 && (
          <div
            data-aos-delay="200"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {coaches.map((coach) => (
              <div
                key={coach._id}
                className="bg-white p-6 rounded-3xl shadow-lg text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 max-w-full"
              >
                <div className="relative">
                  <img
                    src={coach.image || '/assets/default-coach.jpg'}
                    alt={coach.name}
                    className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-teal-100"
                  />
                  <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <h3 className="text-xl font-semibold text-teal-700">
                  {coach.name}
                </h3>
                <button
                  onClick={() => navigate(`/session/${coach._id}`)}
                  className="mt-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 mx-auto shadow-md"
                >
                  <Calendar className="w-5 h-5" /> Book Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FindCoach;