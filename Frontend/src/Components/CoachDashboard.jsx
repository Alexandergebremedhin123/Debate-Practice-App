import React, { useState, useEffect } from "react";
import {  Users, Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmationModel";

const CoachDashboard = () => {
  const [debators, setDebators] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [latestSessions, setLatestSessions] = useState([]);
  const [loading, setLoading] = useState({  debators: true, sessions: true, latest: true });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const coach = localStorage.getItem("User");
    const coachId = coach ? JSON.parse(coach).id : null;

    if (!token || !coachId) {
      setErrors({ general: "Please log in to view your dashboard." });
      setLoading({  debators: false, sessions: false, latest: false });
      toast.error("Please log in to view dashboard");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;


    const fetchDebators = async () => {
      try {
        const response = await axiosInstance.get(`/coach/total-debators/${coachId}`);
        setDebators(response.data.debators);
      } catch (err) {
        setErrors((prev) => ({ ...prev, debators: "Failed to fetch debators" }));
        toast.error("Error loading debators");
        console.error("Debators fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, debators: false }));
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get(`/coach/total-sessions/${coachId}`);
        setSessions(response.data.sessions);
      } catch (err) {
        setErrors((prev) => ({ ...prev, sessions: "Failed to fetch sessions" }));
        toast.error("Error loading sessions");
        console.error("Sessions fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, sessions: false }));
      }
    };

    const fetchLatestSessions = async () => {
      try {
        const response = await axiosInstance.get(`/coach/latest-sessions/${coachId}`);
        setLatestSessions(response.data.latestSessions || []);
      } catch (err) {
        setErrors((prev) => ({ ...prev, latest: "Failed to fetch latest sessions" }));
        toast.error("Error loading latest sessions");
        console.error("Latest sessions fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, latest: false }));
      }
    };

  
    fetchDebators();
    fetchSessions();
    fetchLatestSessions();
  }, []);

  const handleAcceptSession = async (sessionId) => {
    try {
     console.log(sessionId)
      const coachId = JSON.parse(localStorage.getItem("User")).id;
    
      const response = await axiosInstance.put(`/coach/complete-sessions/${coachId}/${sessionId}`);
      toast.success(response.data.message);
      setLatestSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, status: "Completed" } : session
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete session");
      console.error("Accept error:", err);
    }
  };

  const openCompleteModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  const confirmComplete = () => {
    if (selectedSessionId) {
      handleAcceptSession(selectedSessionId);
      setIsModalOpen(false);
      setSelectedSessionId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSessionId(null);
  };

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
          Coach Dashboard
        </h2>

        {errors.general ? (
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-100">
            <p className="text-lg font-medium text-red-600">{errors.general}</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200 transform hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
             
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-200">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <Users className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Debators</p>
                  {loading.debators ? (
                    <Loader2 className="w-6 h-6 text-teal-200 animate-spin" />
                  ) : errors.debators ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{debators}</p>
                  )}
                </div>
              </div>
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-300">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <Calendar className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Sessions</p>
                  {loading.sessions ? (
                    <Loader2 className="w-6 h-6 text-teal-200 animate-spin" />
                  ) : errors.sessions ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{sessions}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-teal-700 mb-4 animate-fadeInUp delay-400">
                Latest Sessions
              </h3>
              {loading.latest ? (
                <div className="flex items-center justify-center py-10 animate-fadeInUp delay-400">
                  <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                    <p className="text-lg font-medium text-gray-700">Loading sessions...</p>
                  </div>
                </div>
              ) : errors.latest ? (
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-400">
                  <p className="text-lg font-medium text-red-600">{errors.latest}</p>
                </div>
              ) : latestSessions.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-400">
                  <p className="text-lg text-gray-500 font-medium">No recent sessions found.</p>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Back to Home
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {latestSessions.map((session, index) => (
                    <div
                      key={session.id}
                      className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:bg-teal-50/50 transform hover:scale-[1.02] animate-fadeInUp"
                      style={{ animationDelay: `${(index + 5) * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-teal-100 rounded-full">
                          <Calendar className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-bold text-sm sm:text-base">{session.debator}</p>
                          <p className="text-sm text-gray-600">{session.time}</p>
                        </div>
                      </div>
                      {session.status === "Pending" ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => openCompleteModal(session._id)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Complete</span>
                            <span className="sm:hidden">Done</span>
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                            session.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : session.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {session.status === "Completed" && <CheckCircle className="w-4 h-4" />}
                          {session.status === "Cancelled" && <XCircle className="w-4 h-4" />}
                          {session.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ConfirmModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={() => handleAcceptSession(selectedSessionId)}
              title="Confirm Session Completion"
              message="Are you sure you want to mark this session as completed?"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CoachDashboard;