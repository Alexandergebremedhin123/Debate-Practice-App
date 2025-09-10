import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, CheckCircle, Loader2, Calendar } from "lucide-react";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmationModel";

const CoachSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    const coachId = user?.id;

    if (!coachId) {
      setError("Coach ID not found. Please log in.");
      setLoading(false);
      toast.error("Please log in to view sessions", { id: "login-error" });
      navigate("/login");
      return;
    }

    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get(`/coach/get-sessions/${coachId}`);
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

  const handleCompleteSession = async (sessionId) => {
    try {
      const user = JSON.parse(localStorage.getItem("User"));
     
      const coachId = user?.id;
      if (!coachId) {
        toast.error("Coach ID not found", { id: "coach-id-error" });
        return;
      }
      const response = await axiosInstance.put(`/coach/complete-sessions/${coachId}/${sessionId}`);
      toast.success(response.data.message || "Session marked as completed");
      setSessions((prev) =>
        prev.map((session) =>
          session._id === sessionId ? { ...session, status: "Completed" } : session
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete session", {
        id: "complete-error",
      });
      console.error("Complete session error:", err);
    }
  };

  const openCompleteModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  const confirmComplete = () => {
    if (selectedSessionId) {
      console.log("completed")
      handleCompleteSession(selectedSessionId);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg animate-fadeInUp">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 animate-fadeInUp">
          <p className="text-lg font-medium text-red-600">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200 transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-500 animate-fadeInUp">
        <h2 className="text-2xl sm:text-3xl text-teal-700 font-bold mb-6">
          Your Sessions
        </h2>
        {sessions.length === 0 ? (
          
          <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-100">
            <p className="text-lg text-gray-500 font-medium">No sessions scheduled.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div
                key={session._id || index}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:bg-teal-50/50 transform hover:scale-[1.02] animate-fadeInUp"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-teal-100 rounded-full">
                    <Calendar className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={session.debatorImage || "https://via.placeholder.com/40"}
                        alt={session.debatorName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-teal-400 shadow-sm"
                      />
                      <p className="text-gray-800 font-bold text-sm sm:text-base">{session.debatorName}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(session.sessionDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {session.time}
                    </p>
               
                
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {session.status === "Cancelled" ? (
                    <span className="px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4" /> Cancelled
                    </span>
                  ) : session.status === "Completed" ? (
                    <span className="px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => openCompleteModal(session._id)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Complete</span>
                      <span className="sm:hidden">Done</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => handleCompleteSession(selectedSessionId)}
        title="Confirm Session Completion"
        message="Are you sure you want to mark this session as completed?"
      />
    </div>
  );
};

export default CoachSessions;