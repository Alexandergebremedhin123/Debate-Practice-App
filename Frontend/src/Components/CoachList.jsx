import React, { useEffect, useState } from "react";
import { Trash2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmationModel";

const CoachList = () => {
  const [approvedCoaches, setApprovedCoaches] = useState([]);
  const [coachRequests, setCoachRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", action: null, id: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const approvedResponse = await axiosInstance.get("coach/get-approved-coaches");
        setApprovedCoaches(approvedResponse.data || []);

        const requestsResponse = await axiosInstance.get("/coach/get-requested-coaches");
        setCoachRequests(requestsResponse.data || []);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemoveCoach = async (coachId) => {
    try {
      await axiosInstance.delete(`/coach/delete-coach/${coachId}`);
      setApprovedCoaches(approvedCoaches.filter((coach) => coach._id !== coachId));
      toast.success("Coach removed successfully");
    } catch (err) {
      toast.error("Failed to remove coach");
      console.error("Remove error:", err);
    }
  };

  const handleApproveCoach = async (requestId) => {
    try {
      const response = await axiosInstance.put(`/coach/approve-coach/${requestId}`);
      const approvedCoach = response.data.coach;
      setCoachRequests(coachRequests.filter((req) => req._id !== requestId));
      setApprovedCoaches([...approvedCoaches, approvedCoach]);
      toast.success("Coach approved successfully");
    } catch (err) {
      toast.error("Failed to approve coach");
      console.error("Approve error:", err);
    }
  };

  const handleRemoveRequest = async (requestId) => {
    try {
      await axiosInstance.delete(`/coach/delete-coach/${requestId}`);
      setCoachRequests(coachRequests.filter((req) => req._id !== requestId));
      toast.success("Coach application removed successfully");
    } catch (err) {
      toast.error("Failed to remove coach application");
      console.error("Remove request error:", err);
    }
  };

  const openModal = (title, message, action, id) => {
    setModalConfig({ title, message, action, id });
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (modalConfig.action && modalConfig.id) {
      modalConfig.action(modalConfig.id);
      setIsModalOpen(false);
      setModalConfig({ title: "", message: "", action: null, id: null });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalConfig({ title: "", message: "", action: null, id: null });
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md border-t-4 border-teal-500 min-h-screen">
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
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 font-semibold mb-4 sm:mb-6 animate-fadeInUp">
        Coach Management
      </h2>

      {loading ? (
        <p className="text-gray-700 text-center text-sm sm:text-base animate-fadeInUp delay-100">
          Loading data...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center text-sm sm:text-base animate-fadeInUp delay-100">
          {error}
        </p>
      ) : (
        <div className="space-y-6 sm:space-y-8">
         
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 animate-fadeInUp delay-200">
              Approved Coach ({approvedCoaches.length})
            </h3>
            {approvedCoaches.length === 0 ? (
              <p className="text-gray-600 text-center text-sm sm:text-base animate-fadeInUp delay-300">
                No approved coaches found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="bg-teal-500 text-white hidden sm:table-row">
                      <th className="p-2 sm:p-3 text-left font-semibold">Image</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Name</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Email</th>
                      <th className="p-2 sm:p-3 text-left переменный">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedCoaches.map((coach, index) => (
                      <tr
                        key={coach._id}
                        className={`border-b flex flex-col sm:table-row ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 animate-fadeInUp`}
                        style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                      >
                        <td className="p-2 sm:p-3 flex items-center sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Image:</span>
                          <img
                            src={coach.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={coach.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-teal-500"
                          />
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Name:</span>
                          {coach.name}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Email:</span>
                          {coach.email || "N/A"}
                        </td>
                        <td className="p-2 sm:p-3 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Actions:</span>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                              onClick={() =>
                                openModal(
                                  "Confirm Coach Removal",
                                  "Are you sure you want to remove this coach?",
                                  handleRemoveCoach,
                                  coach._id
                                )
                              }
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                            <Link
                              to={`/coaches/${coach._id}`}
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-[#007e85] text-white rounded-md hover:bg-teal-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 animate-fadeInUp delay-400">
              Coach Applications ({coachRequests.length})
            </h3>
            {coachRequests.length === 0 ? (
              <p className="text-gray-600 text-center text-sm sm:text-base animate-fadeInUp delay-500">
                No pending coach applications.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="bg-yellow-500 text-white hidden sm:table-row">
                      <th className="p-2 sm:p-3 text-left font-semibold">Image</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Name</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Email</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coachRequests.map((request, index) => (
                      <tr
                        key={request._id}
                        className={`border-b flex flex-col sm:table-row ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 animate-fadeInUp`}
                        style={{ animationDelay: `${(index + 5) * 0.1}s` }}
                      >
                        <td className="p-2 sm:p-3 flex items-center sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Image:</span>
                          <img
                            src={request.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={request.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-yellow-500"
                          />
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Name:</span>
                          {request.name}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Email:</span>
                          {request.email || "N/A"}
                        </td>
                        <td className="p-2 sm:p-3 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Actions:</span>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                              onClick={() =>
                                openModal(
                                  "Confirm Coach Approval",
                                  "Are you sure you want to approve this coach?",
                                  handleApproveCoach,
                                  request._id
                                )
                              }
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                openModal(
                                  "Confirm Application Removal",
                                  "Are you sure you want to remove this coach application?",
                                  handleRemoveRequest,
                                  request._id
                                )
                              }
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                            <Link
                              to={`/coaches/${request._id}`}
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-[#007e85] text-white rounded-md hover:bg-teal-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default CoachList;