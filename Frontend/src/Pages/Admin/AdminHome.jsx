import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Dashboard } from "../../Components/Dashboard";
import AddCoach from "../../Components/AddCoach";
import CoachList from "../../Components/CoachList";
import Sessions from "../../Components/Sessions";
import AOS from "aos";
import "aos/dist/aos.css";
import { LayoutDashboard, Calendar, UserPlus, Users } from "lucide-react";
import { AdminNavbar } from "../../Components/AdminNavbar";
import FullDetails from "../../Components/CoachProfile";


const categoryIcons = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Sessions: <Calendar className="w-5 h-5" />,
  "Add Coach": <UserPlus className="w-5 h-5" />,
  "Coach List": <Users className="w-5 h-5" />,
};

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToCategory = {
    "/dashboard": "Dashboard",
    "/sessions": "Sessions",
    "/add-coach": "Add Coach",
    "/coach-list": "Coach List",

  };

  const [selectedCategory, setSelectedCategory] = useState(() => {
    return pathToCategory[location.pathname] || "Dashboard";
  });

  useEffect(() => {
    const category = pathToCategory[location.pathname] || "Dashboard";
    setSelectedCategory(category);
  }, [location.pathname]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  const categories = ["Dashboard", "Sessions", "Add Coach", "Coach List"];

  const categoryToPath = {
    Dashboard: "/dashboard",
    Sessions: "/sessions",
    "Add Coach": "/add-coach",
    "Coach List": "/coach-list",
 
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(categoryToPath[category]);
  };

  const renderContent = () => (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/add-coach" element={<AddCoach />} />
      <Route path="/coach-list" element={<CoachList />} />
      <Route path="/coaches/:id" element={<FullDetails />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            <div
              data-aos="fade-up"
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md lg:sticky lg:top-16 sm:lg:top-20 h-fit border-t-4 border-teal-500"
            >
              <h2 className="text-xl sm:text-2xl text-gray-900 font-semibold mb-4 sm:mb-6 text-center">
                Categories
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {categories.map((category) => (
                  <li
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-[#007e85] text-white shadow-md"
                        : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                    }`}
                  >
                    {categoryIcons[category]}
                    <span className="font-medium text-sm sm:text-base">{category}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-aos="fade-up" className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;