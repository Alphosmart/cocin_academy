import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Home from "./pages/public/Home";
import SimplePage from "./pages/public/SimplePage";
import Academics from "./pages/public/Academics";
import Admissions from "./pages/public/Admissions";
import Portal from "./pages/public/Portal";
import Blog from "./pages/public/Blog";
import SingleBlog from "./pages/public/SingleBlog";
import Gallery from "./pages/public/Gallery";
import Events from "./pages/public/Events";
import SingleEvent from "./pages/public/SingleEvent";
import Staff from "./pages/public/Staff";
import FAQ from "./pages/public/FAQ";
import Contact from "./pages/public/Contact";
import NotFound from "./pages/public/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Messages from "./pages/admin/Messages";
import Users from "./pages/admin/Users";
import ChangePassword from "./pages/admin/ChangePassword";
import {
  AcademicManager,
  AdmissionsManager,
  BlogManager,
  EventManager,
  FAQManager,
  GalleryManager,
  HomepageManager,
  SettingsManager,
  StaffManager,
  PageManager,
  TestimonialManager
} from "./pages/admin/Managers";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<SimplePage slug="about" />} />
        <Route path="academics" element={<Academics />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="portal" element={<Portal />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<SingleBlog />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:slug" element={<SingleEvent />} />
        <Route path="staff" element={<Staff />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<SimplePage slug="privacy-policy" />} />
      </Route>
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<SettingsManager />} />
          <Route path="homepage" element={<HomepageManager />} />
          <Route path="pages" element={<PageManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="events" element={<EventManager />} />
          <Route path="academics" element={<AcademicManager />} />
          <Route path="admissions" element={<AdmissionsManager />} />
          <Route path="staff" element={<StaffManager />} />
          <Route path="testimonials" element={<TestimonialManager />} />
          <Route path="faqs" element={<FAQManager />} />
          <Route path="messages" element={<Messages />} />
          <Route path="users" element={<Users />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="logout" element={<Navigate to="/admin/login" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
