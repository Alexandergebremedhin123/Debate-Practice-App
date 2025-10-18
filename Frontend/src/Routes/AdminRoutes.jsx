import { Routes, Route } from "react-router-dom";
import AdminHome from "../Pages/Admin/AdminHome";
import { AdminNavbar } from "../Components/AdminNavbar";
import NotFound from "../Pages/User/NotFound";

function AdminRoutes() {
  return (
    <>
    <AdminNavbar/>
     <Routes>
      <Route path="/*" element={<AdminHome />} />
      <Route path="/*" element={<NotFound/>} />
    </Routes>
    </>
      );

   
}

export default AdminRoutes;
