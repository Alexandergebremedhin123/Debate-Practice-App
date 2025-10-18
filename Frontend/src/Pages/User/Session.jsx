import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleCheck, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { timeSlots } from "../../Constants/ConstantData";
import { axiosInstance } from "../../axios";
import toast from "react-hot-toast";


const Session = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    if (!user) {
      toast.error("Please login first", { id: "login-error" });
      navigate("/login");
      return;
    }

    const fetchCoachProfile = async () => {
      const coachId = id || localStorage.getItem("user.id");
      if (!coachId) {
        setError("No coach ID found. Please select a coach or log in.");
        setLoading(false);
        toast.error("Coach ID missing", { id: "coach-id-error" });
        return;
      }

      try {
        const response = await axiosInstance.get(`/coach/get-coach/${coachId}`);
        setCoach(response.data);
      } catch (err) {
        setError("Failed to fetch coach profile. Please try again.");
        toast.error(err.response?.data?.message || "Error loading coach profile", {
          id: "fetch-error",
        });
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachProfile();
  }, [id, navigate]);

  const isSunday = (date) => date.getDay() === 0;

 const handleBooking = async () => {
  if (!coach || !selectedDate || !selectedTime) {
    toast.error("Please select a date and time slot.", { id: "validation-error" });
    return;
  }

  const user = JSON.parse(localStorage.getItem("User"));
  if (!user || !user.id) {
    toast.error("User not authenticated. Please log in again.", { id: "auth-error" });
    navigate("/login");
    return;
  }

  try {
    const token = localStorage.getItem("Token");

    const response = await axiosInstance.post(
      "/user/set-session", 
      {
        coachId: coach._id,
        date: selectedDate.toISOString(),
        time: selectedTime,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
console.log("Booking response:", response.data);
    toast.success("Booking confirmed successfully!");

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to book session", {
      id: "booking-error",
    });
    console.error("Booking error:", err);
  } 
};


  if (loading) {
    return (
      <div className="min-h-screen mt-14 flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-pulse">
          <svg className="w-6 h-6 text-tealorganizer-200" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700">Loading coach profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-14 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 text-center animate-slideIn">
          <p className="text-lg font-medium text-red-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-14 flex flex-col items-center bg-gray-50">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes calendarFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease-out forwards;
          }
          .animate-bounce:hover {
            animation: bounce 0.3s ease-in-out;
          }
          .animate-pulse-button {
            animation: pulse 2s ease-in-out infinite;
          }
          .animate-calendarFadeIn {
            animation: calendarFadeIn 0.6s ease-out forwards;
          }
          .custom-calendar {
            font-family: 'Inter', sans-serif;
            border: none !important;
            border-radius: 1rem;
            padding: 1.5rem;
            background: linear-gradient(145deg, #ffffff, #f0fdfa);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          }
          .custom-calendar .react-calendar__tile {
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 1.1rem;
            transition: background 0.2s ease, transform 0.2s ease;
          }
          .custom-calendar .react-calendar__tile:hover {
            background: #e6fffa !important;
            transform: scale(1.05);
          }
          .custom-calendar .react-calendar__tile--active {
            background: #007E85 !important;
            color: white !important;
          }
          .custom-calendar .react-calendar__navigation {
            margin-bottom: 1.5rem;
          }
          .custom-calendar .react-calendar__navigation button {
            font-size: 1.2rem;
            font-weight: 600;
            color: #007E85;
          }
        `}
      </style>
      <header className="w-full py-8 sm:py-12 bg-gradient-to-b from-teal-50 to-white rounded-b-3xl">
        <div className="container mx-auto px-4">
          <div className="w-full flex justify-center">
            <div
              className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-teal-100 transition-all duration-300 hover:shadow-xl "
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="w-full sm:w-1/3 flex justify-center">
                  <img
                    src={
                      coach.image ||
                      "../../public/assets/Male-young-coach-transparent-PNG-removebg-preview.png"
                    }
                    alt={coach.name}
                    className="w-40 h-40 sm:w-52 sm:h-52 rounded-full object-cover border-4 border-teal-500 shadow-md"
                  />
                </div>
                <div className="w-full sm:w-2/3 flex flex-col p-4 sm:p-6">
                  <h2 className="text-3xl sm:text-4xl text-teal-700 font-bold flex items-center gap-2 mb-3">
                    <User className="w-6 h-6 text-teal-500" />
                    {coach.name} <CircleCheck className="text-teal-500 w-6 h-6 sm:w-7 sm:h-7" />
                  </h2>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12 flex flex-col gap-8 sm:gap-12 items-center max-w-6xl">
        <div className="w-full rounded-2xl p-4 sm:p-8 bg-white shadow-lg border border-teal-100 animate-slideIn">
          <section>
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-teal-700 mb-4 sm:mb-6 tracking-tight flex items-center justify-center gap-2">
              <CalendarIcon className="w-8 h-8 text-teal-500" />
              Book Your Session
            </h2>
            <p className="text-gray-600 text-center max-w-xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
              Choose your preferred date and time slot for a seamless booking experience with{" "}
              {coach.name}.
            </p>
            <div className="flex justify-center">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileDisabled={({ date }) => isSunday(date) || date < new Date()}
                className="custom-calendar mt-5 sm:mb-8 max-w-md sm:max-w-lg animate-calendarFadeIn"
                prevLabel={<ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-teal-700" />}
                nextLabel={<ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-teal-700" />}
                prev2Label={<ChevronsLeft className="w-6 h-6 sm:w-7 sm:h-7 text-teal-700" />}
                next2Label={<ChevronsRight className="w-6 h-6 sm:w-7 sm:h-7 text-teal-700" />}
              />
            </div>

            {selectedDate && (
              <p className="text-center mt-4 mb-6 sm:mb-8 text-xl sm:text-2xl font-medium text-white bg-teal-600 py-2 px-4 rounded-lg shadow-md ">
                Selected: <span className="font-semibold">{selectedDate.toDateString()}</span>
              </p>
            )}
          </section>

          <section className="mb-6 mt-9 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-center text-teal-700 mb-4 flex items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-teal-500 animate-spin" />
              Available Time Slots
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 justify-center">
              {timeSlots.map((time, index) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg font-medium rounded-xl shadow-sm transition-all duration-300 animate-slideIn ${
                    selectedTime === time
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                      : "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 hover:shadow-md hover:scale-105"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {time}
                </button>
              ))}
            </div>
          </section>

          <div className="text-center">
            <button
              onClick={handleBooking}
              className={`bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 px-8 sm:py-4 sm:px-12 text-lg sm:text-xl rounded-full shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto animate-pulse-button ${
                "hover:scale-105 active:scale-95"
              }`}
            >
              { " Book Session"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Session;
