import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Bell, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../axios';

export const AdminNavbar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notificationRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('User') || '{}');
  const token = localStorage.getItem('Token');

  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchNotifications = async () => {
    if (isClearing) return;
    try {
      const response = await axiosInstance.get(`/user/get-notifications/${user.id}`);
      setNotifications(response.data || []);
    } catch (err) {
      toast.error('Failed to fetch notifications');
      console.error('Notifications fetch error:', err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (token && user.id) {
      fetchNotifications();
    }
  }, [token, user.id]);

  useEffect(() => {
    const handleRefreshNotifications = () => {
      if (token && user.id && !isClearing) {
        fetchNotifications();
      }
    };
    window.addEventListener('refreshNotifications', handleRefreshNotifications);
    return () => {
      window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    };
  }, [token, user.id, isClearing]);

 
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

 
  const handleClearNotifications = async () => {
    try {
      setIsClearing(true);
      await axiosInstance.delete(`/user/clear-notifications/${user.id}`);
      setNotifications([]);
      toast.success('Notifications cleared');
    } catch (err) {
      toast.error('Failed to clear notifications');
      console.error('Clear notifications error:', err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('User');
    toast.success('Logout successful!');
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-16 sm:h-20 flex items-center font-lato transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      } px-4 sm:px-6 md:px-8`}
    >
      <div className="w-full max-w-[100vw] flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative flex items-center focus:outline-none p-1 sm:p-2"
              aria-label="View notifications"
            >
              <Bell
                size={20}
                className="text-[#008080] hover:text-[#006666] transition-colors duration-200"
              />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl z-50 border border-gray-100 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-dropdown">
                {notifications.length === 0 ? (
                  <p className="px-4 py-3 text-gray-700 text-sm text-center">
                    No notifications
                  </p>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <div
                        key={notification._id || notification.id}
                        className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-[#008080] hover:text-white transition-colors duration-200"
                      >
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    <div className="sticky bottom-0 bg-white border-t border-gray-100">
                      <button
                        onClick={fetchNotifications}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm"
                        aria-label="Refresh notifications"
                      >
                        <RefreshCw size={14} /> Refresh Notifications
                      </button>
                      <button
                        onClick={handleClearNotifications}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white rounded-b-lg transition-colors duration-200 text-sm"
                        aria-label="Clear all notifications"
                      >
                        Clear Notifications
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-[#008080] text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md font-semibold hover:bg-[#006666] flex items-center text-sm sm:text-base"
          >
            <LogOut size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes dropdown {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
        @media (max-width: 640px) {
          .navbar {
            height: 14rem; /* Increased height to accommodate large logo */
          }
          .animate-dropdown {
            width: 90vw; /* Full width minus padding on mobile */
            right: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
};