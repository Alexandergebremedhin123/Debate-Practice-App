import React from "react";
import { Route, Routes } from "react-router-dom";
import CoachPage from "../Pages/Coach/CoachHome";


const CoachRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<CoachPage />} />
      </Routes>
    </div>
  );
};

export default CoachRoutes;
