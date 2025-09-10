import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, User, Phone, UserRoundPlus, ChevronDown, Calendar, LogOut, Bell, RefreshCw } from "lucide-react";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";

const menuItems = [
  { to: "/", icon: <Home size={20} />, label: "Home" },
  { to: "/coaches", icon: <User size={20} />, label: "Coaches" },
  { to: "/contact", icon: <Phone size={20} />, label: "Contact" },
  { to: "/apply", icon: <UserRoundPlus size={20} />, label: "Apply" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const token = localStorage.getItem("Token");
  const user = JSON.parse(localStorage.getItem("User") || "{}");
  const profileImage = user.image;
  const notificationRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(`/user/get-notifications/${user.id}`);
      setNotifications(response.data || []);
    } catch (err) {
      toast.error("Failed to fetch notifications");
      console.error("Notifications fetch error:", err);
      
    }
  };

  useEffect(() => {
    if (token && user.id) {
      fetchNotifications();
    }
  }, [token, user.id]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    window.location.href = "/login";
  };

  const handleClearNotifications = async () => {
    try {
      await axiosInstance.delete(`/user/clear-notifications/${user.id}`);
      setNotifications([]);
      toast.success("Notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
      console.error("Clear notifications error:", err);
    }
  };

  return (
    <nav className={`p-4 fixed navbar top-0 left-0 w-full z-50 h-16 flex items-center transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent shadow-none'} font-lato`}>
      <div className="container mx-auto flex justify-between items-center">
      

        <button className="md:hidden text-black z-50" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? null : <Menu size={28} />}
        </button>

        <ul className="hidden md:flex font-semibold space-x-6 text-black text-md">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className="hover:text-[#008080] hover:underline flex items-center transition-colors duration-200"
              >
                {item.icon} <span className="ml-2">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex space-x-4 items-center relative">
          {token && profileImage ? (
            <>
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative flex items-center focus:outline-none p-2"
                  style={{ cursor: "pointer" }}
                  aria-label="View notifications"
                >
                  <Bell size={24} className="text-[#008080] hover:text-[#006666] transition-colors duration-200" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-56 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl z-50 border border-gray-100 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-dropdown">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-3 text-gray-700 text-sm text-center">No notifications</p>
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
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white transition-colors duration-200 flex items-center gap-2"
                            aria-label="Refresh notifications"
                          >
                            <RefreshCw size={16} /> Refresh Notifications
                          </button>
                          <button
                            onClick={handleClearNotifications}
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white rounded-b-lg transition-colors duration-200"
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

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none group"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#008080] group-hover:border-[#006666] transition-all duration-200"
                  />
                  <ChevronDown size={20} className="ml-2 text-[#008080] group-hover:text-[#006666] transition-colors duration-200" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-100 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-dropdown">
                    <Link
                      to="/user-profile"
                      className="block px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white rounded-t-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={18} /> Profile
                    </Link>
                    <Link
                      to="/booked-sessions"
                      className="block px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white transition-colors duration-200 flex items-center gap-2"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Calendar size={18} /> Sessions
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full cursor-pointer text-left px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white rounded-b-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-[#008080] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#006666] transition-colors duration-200"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-opacity-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      ></div>

      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-xl p-6 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button className="absolute top-4 right-4 text-black" onClick={() => setIsOpen(!isOpen)}>
          <X size={28} />
        </button>
        <div className="mt-12">
          {token && profileImage && (
            <div className="mb-8 flex items-center border-b border-gray-200 pb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#008080]"
              />
              <div className="ml-4 space-y-2">
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-[#008080] font-semibold transition-colors duration-200 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} /> Profile
                </Link>
                <Link
                  to="/booked-sessions"
                  className="block text-gray-700 hover:text-[#008080] font-semibold transition-colors duration-200 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar size={18} /> Sessions
                </Link>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="block text-gray-700 cursor-pointer hover:text-[#008080] font-semibold transition-colors duration-200 flex items-center gap-2"
                  aria-label="View notifications"
                >
                  <Bell cursor={"pointer"} size={18} />
                  Notifications
                  {notifications.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="mt-2 bg-white rounded-lg shadow-md p-4 border border-gray-200 max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-gray-700 text-sm">No notifications</p>
                    ) : (
                      <>
                        {notifications.map((notification) => (
                          <div
                            key={notification._id || notification.id}
                            className="py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <p className="text-gray-700 text-sm">{notification.message}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-2">
                          <button
                            onClick={fetchNotifications}
                            className="block w-full text-left text-gray-700 hover:text-[#008080] font-semibold flex items-center gap-2"
                            aria-label="Refresh notifications"
                          >
                            <RefreshCw size={16} /> Refresh Notifications
                          </button>
                          <button
                            onClick={handleClearNotifications}
                            className="block w-full text-left mt-2 text-gray-700 hover:text-[#008080] font-semibold"
                            aria-label="Clear all notifications"
                          >
                            Clear Notifications
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="block text-gray-700 hover:text-[#008080] font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}
          <ul className="space-y-4 text-lg font-semibold">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#008080] flex items-center transition-colors duration-200"
                >
                  {item.icon} <span className="ml-2">{item.label}</span>
                </Link>
              </li>
            ))}
            {!token && (
              <>
                <li>
                  <Link
                    to="/apply"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#008080] transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#008080] transition-colors duration-200"
                  >
                    Log In
                  </Link>
                </li>
              </>
            )}
          </ul>
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
      `}</style>
    </nav>
  );
};

export default Navbar;