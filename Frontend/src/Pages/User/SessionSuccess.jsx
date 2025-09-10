import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import useNotificationStore from "../../Store/NotificationStore";
import Confetti from "react-confetti";

const SessionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); 
  const [showConfetti, setShowConfetti] = useState(false);
  const hasRun = useRef(false); 
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true;

    const bookSession = async () => {
      const sessionId = searchParams.get("session_id");
      const coachId = searchParams.get("coachId");
      const date = searchParams.get("date");
      const time = searchParams.get("time");
      const debatorId = searchParams.get("debatorId");

      if (!sessionId || !coachId || !date || !time || !debatorId) {
        setStatus("error");
        toast.error("Invalid booking details", { id: "invalid-params" });
        setTimeout(() => navigate("/booked-sessions"), 2000);
        return;
      }

      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          setStatus("error");
          toast.error("Please log in again", { id: "auth-error" });
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const response = await axiosInstance.post(
          "/user/set-session",
          {
            coachId,
            date,
            time,
            sessionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStatus("success");
        setShowConfetti(true); 
        toast.success(response.data.message || "Session booked successfully!");
        fetchNotifications(debatorId);

        setTimeout(() => setShowConfetti(false), 5000);
        setTimeout(() => navigate("/booked-sessions"), 5000);
      } catch (err) {
        setStatus("error");
        const errorMessage = err.response?.data?.message || "Failed to confirm session";
        toast.error(errorMessage, { id: "confirm-error" });
        setTimeout(() => navigate("/booked-sessions"), 2000);
      }
    };

    bookSession();
  }, [fetchNotifications,navigate,searchParams]);//or [] 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth || document.documentElement.clientWidth}
          height={window.innerHeight || document.documentElement.clientHeight}
          recycle={false}
          numberOfPieces={600}
          gravity={0.5}
          tweenDuration={2000}
        />
      )}
      <div className="flex flex-col items-center z-10">
        {status === "loading" && (
          <>
            <Loader className="w-12 h-12 text-teal-500 animate-spin" />
            <p className="mt-4 text-lg text-gray-700 font-medium">Processing your session...</p>
          </>
        )}
        {status === "success" && (
          <p className="text-lg text-teal-500 font-medium">Session booked! Redirecting...</p>
        )}
        {status === "error" && (
          <p className="text-lg text-red-500 font-medium">Error booking session. Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default SessionSuccess;