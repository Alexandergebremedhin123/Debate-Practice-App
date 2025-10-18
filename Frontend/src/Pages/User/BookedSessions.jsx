import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {  Loader, Calendar } from "lucide-react";
import { axiosInstance } from "../../axios";
import toast from "react-hot-toast";
import ConfirmModal from "../../Components/ConfirmationModel";

const BookedSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const user = JSON.parse(localStorage.getItem("User") || "{}");
    const debatorId = user?.id;

    if (!token || !debatorId) {
      setError("Please log in to view your sessions.");
      setLoading(false);
      toast.error("Please log in to view sessions", { id: "login-error" });
      navigate("/login");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get(`user/get-sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setSessions(response.data.sessions || []);
      } catch (err) {
        setError("Failed to fetch sessions. Please try again.");
        toast.error(err.response?.data?.message || "Error loading sessions", {
          id: "fetch-error",
        });
        console.error("Fetch sessions error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);



  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await axiosInstance.delete(`/user/delete-session/${sessionId}`);
      toast.success(response.data.message || "Session is cancelled successfully");
      setSessions((prev) => prev.filter((session) => session._id !== sessionId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete session", {
        id: "delete-error",
      });
      console.error("Delete session error:", err);
    }
  };


  const openCancelModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    if (selectedSessionId) {
      
      handleDeleteSession(selectedSessionId);
      setIsModalOpen(false);
      setSelectedSessionId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSessionId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader className="w-14 h-14 text-teal-500 animate-spin" />
          <p className="text-gray-700 text-xl font-semibold">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border-l-4 border-red-500 max-w-lg text-center transform transition-all duration-300 hover:shadow-xl">
          <p className="text-gray-800 text-xl font-semibold mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg text-base font-medium hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-14 from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl shadow-xl p-8 mb-10 flex items-center justify-between transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-yellow-400 rounded-full shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">Total Sessions</p>
              <p className="text-5xl font-extrabold tracking-tight">{sessions.length}</p>
            </div>
          </div>
          <Link
            to="/coaches"
            className="inline-flex items-center px-6 py-3 bg-white text-teal-600 rounded-lg text-base font-medium hover:bg-teal-50 transition-all duration-300 shadow-md"
          >
            Book New Session
          </Link>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Your Booked Sessions
        </h2>

        {sessions.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform transition-all duration-300 hover:shadow-2xl">
            <Calendar className="w-20 h-20 text-teal-500 mx-auto mb-6" />
            <p className="text-gray-800 text-2xl font-semibold mb-3">No sessions booked yet</p>
            <p className="text-gray-600 text-lg mb-6">
              Schedule a visit with a coach to get started!
            </p>
            <Link
              to="/coaches"
              className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg text-base font-medium hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Find a Coach
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-5 mb-4 sm:mb-0">
                  <div className="p-3 bg-teal-100 rounded-full">
                    <Calendar className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-xl font-bold">{session.coachName}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(session.sessionDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                      , {session.time}
                    </p>
                
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                  <span
                    className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
                      session.status === "Cancellation Requested"
                        ? "bg-orange-100 text-orange-700"
                        : session.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : session.status === "Completed"
                        ? "bg-teal-100 text-teal-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {session.status}
                  </span>
                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    {session.status === "Pending" && (
                      <button
                        onClick={() => openCancelModal(session._id)}
                        className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                        title="Cancel session"
                        aria-label="Cancel session"
                      >
                        Cancel
                      </button>
                    )}
              
                    {session.status === "Cancelled" && (
                      <>
                      
                        <button
                          onClick={() => handleDeleteSession(session._id)}
                          className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Delete session"
                          aria-label="Delete session"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmCancel}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this session?"
      />
    </div>
  );
};

export default BookedSessions;
