import {
    CalendarDays,
    ChevronDown,
    Clock,
    LogOut,
    MapPin,
    Search,
    Star,
    Ticket,
    Users,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import BrowseEvents from "./BrowseEvents.jsx";
import Tickets from "./Tickets.jsx";

const myEvents = ["Registered Events", "Upcoming Events", "Completed Events"];

export default function UserDashboard() {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState("browse");
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);

    // Read user from localStorage (saved by login.jsx)
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = storedUser?.name || "User";
    const userEmail = storedUser?.email || "";
    const avatarLetter = userName.charAt(0).toUpperCase();

    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        }
        if (showProfile) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showProfile]);

    function handleSignOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <main className="browse-page">
            <nav className="browse-nav">
                <button className="browse-brand" onClick={() => navigate("/")} type="button">
                    NexEvent
                </button>

                <div className="browse-nav-links">
                    <a
                        href="#browseEvents"
                        className={activeLink === "browse" ? "active-nav" : ""}
                        onClick={() => setActiveLink("browse")}
                    >
                        Browse Events
                    </a>
                    <div className="category-menu">
                        <button type="button">
                            My Events
                            <ChevronDown size={16} />
                        </button>
                        <div className="category-dropdown">
                            {myEvents.map((event) => (
                                <a
                                    href={`#${event.toLowerCase()}`}
                                    key={event}
                                    className={activeLink === event ? "active-me" : ""}
                                    onClick={() => setActiveLink(event)}
                                >
                                    {event}
                                </a>
                            ))}
                        </div>
                    </div>
                    <a
                        href="#tickets"
                        className={activeLink === "tickets" ? "active-nav" : ""}
                        onClick={() => setActiveLink("tickets")}
                    >
                        Tickets
                    </a>
                    <a
                        href="#gallery"
                        className={activeLink === "gallery" ? "active-nav" : ""}
                        onClick={() => setActiveLink("gallery")}
                    >
                        Gallery
                    </a>

                    {/* Profile button + card */}
                    <div className="profile-wrapper" ref={profileRef}>
                        <button
                            className="userProfile"
                            onClick={() => setShowProfile((prev) => !prev)}
                            aria-label="Open profile"
                            type="button"
                        >
                            {avatarLetter}
                        </button>

                        {showProfile && (
                            <div className="profile-card">
                                <button
                                    className="profile-card-close"
                                    onClick={() => setShowProfile(false)}
                                    aria-label="Close"
                                    type="button"
                                >
                                    <X size={15} />
                                </button>

                                <div className="profile-card-top">
                                    <div className="profile-avatar">{avatarLetter}</div>
                                    <p className="profile-name">{userName}</p>
                                    <p className="profile-email">{userEmail}</p>
                                    <button className="profile-manage-btn" type="button">
                                        Manage account
                                    </button>
                                </div>

                                <div className="profile-card-bottom">
                                    <button
                                        className="profile-signout-btn"
                                        type="button"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut size={15} />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <section className="content">
                {activeLink === "browse" && <BrowseEvents />}
                {activeLink === "tickets" && <Tickets />}
            </section>

            <footer className="browse-footer">
                <div>
                    <strong>NexEvent</strong>
                    <p>Discover, plan, and attend events with ease.</p>
                </div>
                <p className="footer-copy">© 2026 NexEvent. All rights reserved.</p>
            </footer>
        </main>
    );
}