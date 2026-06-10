<<<<<<< HEAD
import './App.css'
import NexEvent from "./NexEvent";

export default function App() {
  return <NexEvent />;
}
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NexEvent from "./Landing Page/NexEvent";
import EventsSection from "./Landing Page/EventsSection";
import Footer from "./Landing Page/Footer";

import Login from "./pages/login";
import Signup from "./pages/signup";

function Home() {
  return (
    <>
      <NexEvent />
      <EventsSection />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
>>>>>>> 16480e6a512a5820e13fbbcf0da0e2cb347a38ed
