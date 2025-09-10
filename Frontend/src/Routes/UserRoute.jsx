import { Routes, Route } from "react-router-dom";
import Home from "../Pages/User/Home";
import Session from "../Pages/User/Session";
import ContactForm from "../Pages/User/Contact";
import ServicesSection from "../Pages/User/Services";
import CoachesPage from "../Pages/User/Coaches";
import CoachApplication from "../Pages/User/CoachApply";
import UserProfile from "../Components/UserProfile";
import BookedSessions from "../Pages/User/BookedSessions";
import SessionSuccess from "../Pages/User/SessionSuccess";
import NotFound from "../Pages/User/NotFound";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesSection />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/coaches" element={<CoachesPage />} />
      <Route path="/coaches/:coachcategory" element={<CoachesPage />} />
      <Route path="/apply" element={<CoachApplication />} />
      <Route path="/session/:id" element={<Session />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/booked-sessions" element={<BookedSessions />} />
      <Route path='/session/success' element={<SessionSuccess/>}/>
      <Route path="*" element={<NotFound/>} /> 
    </Routes>
  );
}

export default UserRoutes;
