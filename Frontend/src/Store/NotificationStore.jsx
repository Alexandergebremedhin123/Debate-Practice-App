import { create } from "zustand";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";

const useNotificationStore = create((set) => ({
  notifications: [],
  fetchNotifications: async (debatorId) => {
    try {
      const response = await axiosInstance.get(`/user/get-notifications/${debatorId}`);
      set({ notifications: response.data || [] });
    } catch (err) {
      toast.error("Failed to fetch notifications");
      console.error("Notifications fetch error:", err);
    }
  },
  clearNotifications: async (debatorId) => {
    try {
      await axiosInstance.delete(`/notifications/${debatorId}`);
      set({ notifications: [] });
      toast.success("Notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
      console.error("Clear notifications error:", err);
    }
  },
}));

export default useNotificationStore;