// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Calendar,Users, CheckCircle,XCircle,Loader2} from "lucide-react";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";


export const Dashboard = () => {
  const [coachesCount, setCoachesCount] = useState(0);
  const [debatorsCount, setDebatorsCount] = useState(0);
  const [latestSessions, setLatestSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [limit] = useState(10);
 

  useEffect(() => {
    const fetchDashboardData = async () => {
      let newErrors = {};

      try {
        const coachesResponse = await axiosInstance.get("/coach/total-coaches");
        setCoachesCount(coachesResponse.data.totalNoOfCoaches || 0);
      } catch (err) {
        newErrors.coaches = "Failed to fetch coaches count.";
        console.error("Coaches fetch error:", err);
        toast.error("Error loading coaches count");
      }

      try {
        const debatorsResponse = await axiosInstance.get("/user/total-debators");
        setDebatorsCount(debatorsResponse.data.totalNoOfDebators || 0);
      } catch (err) {
        newErrors.debators = "Failed to fetch debators count.";
        console.error("Debators fetch error:", err);
        toast.error("Error loading debators count");
      }

      try {
        const sessionsResponse = await axiosInstance.get("/admin/GetLatestSessions");
        setLatestSessions(sessionsResponse.data || []);
      } catch (err) {
        newErrors.sessionsList = "Failed to fetch latest sessions.";
        console.error("Sessions fetch error:", err);
        toast.error("Error loading latest sessions");
      }

      setErrors(newErrors);
      setLoading(false);
    };

    fetchDashboardData();
  }, [ limit]);



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
          Admin Dashboard
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-10 animate-fadeInUp delay-100">
            <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-100">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <Users className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Coaches</p>
                  {errors.coaches ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{coachesCount}</p>
                  )}
                </div>
              </div>
            
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-300">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <Users className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Debators</p>
                  {errors.debators ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{debatorsCount}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-teal-700 mb-4 animate-fadeInUp delay-400">
                Latest Sessions
              </h3>
              {errors.sessionsList ? (
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-400">
                  <p className="text-lg font-medium text-red-600">{errors.sessionsList}</p>
                </div>
              ) : latestSessions.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-400">
                  <p className="text-lg text-gray-500 font-medium">No recent sessions found.</p>
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
                          <p className="text-sm text-gray-600">
                            {session.time} | {session.coach} | {session.date}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                          session.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : session.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : session.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {session.status === "Completed" && <CheckCircle className="w-4 h-4" />}
                        {session.status === "Cancelled" && <XCircle className="w-4 h-4" />}
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
