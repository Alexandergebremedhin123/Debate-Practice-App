import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import { Calendar, XCircle } from "lucide-react";
import ConfirmModal from "./ConfirmationModel";

export const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get("/admin/GetAllSessions");
        setSessions(response.data || []);
      } catch (err) {
        setError("Failed to fetch sessions.");
        console.error("Sessions fetch error:", err);
        toast.error("Error loading sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleDelete = async (sessionId) => {
    try {
      await axiosInstance.delete(`/admin/delete-session/${sessionId}`);
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      toast.success("Session deleted successfully");
    } catch (err) {
      console.error("Error deleting session:", err);
      toast.error(err.response?.data?.message || "Failed to delete session");
    }
  };

  const openDeleteModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSessionId) {
      handleDelete(selectedSessionId);
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
          Sessions
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-10 animate-fadeInUp delay-100">
            <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
              <XCircle className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="text-lg font-medium text-gray-700">Loading sessions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-100">
            <p className="text-lg font-medium text-red-600">{error}</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-100">
            <p className="text-lg text-gray-500 font-medium">No sessions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:bg-teal-50/50 transform hover:scale-[1.02] animate-fadeInUp"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-teal-100 rounded-full">
                    <Calendar className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-sm sm:text-base">{session.debator}</p>
                    <p className="text-sm text-gray-600">Coach: {session.coach}</p>
                    <p className="text-sm text-gray-600">
                      {session.date} | {session.time}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                      session.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : session.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : session.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {session.status}
                  </span>
                  {session.status !== "Pending" && (
                    <button
                      onClick={() => openDeleteModal(session.id)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <XCircle className="w-4 h-4" />
                      Delete
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
        onConfirm={confirmDelete}
        title="Confirm Session Deletion"
        message="Are you sure you want to delete this session?"
      />
    </div>
  );
};

export default Sessions;