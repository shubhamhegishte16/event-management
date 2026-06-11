import {
    CalendarDays,
    ChevronDown,
    Clock,
    MapPin,
    Search,
    Star,
    Ticket,
    Users,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import "./UserDashboard.css";
import BrowseEvents from "./BrowseEvents.jsx";
import Tickets from "./Tickets.jsx";

const myEvents = ["Registered Events", "Upcoming Events", "Completed Events"];

export default function UserDashboard({ onBackHome }) {

    const [activeLink, setActiveLink] = useState("browse");

    return (
        <main className="browse-page">
            <nav className="browse-nav">
                <button className="browse-brand" onClick={onBackHome} type="button">
                    NexEvent
                </button>

                <div className="browse-nav-links">
                    <a
                        href="#browseEvents"
                        className={activeLink === "browse" ? "active-nav" : ""}
                        onClick={() => setActiveLink("browse")}>
                        Browse Events
                    </a>
                    <div className="category-menu">
                        <button type="button">
                            My Events
                            <ChevronDown size={16} />
                        </button>
                        <div className="category-dropdown">
                            {myEvents.map((event) => (
                                <a href={`#${event.toLowerCase()}`}
                                    key={event}
                                    className={activeLink === "event" ? "active-me" : ""}
                                    onClick={() => setActiveLink(event)}>
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
                    <button className="userProfile">U</button>
                </div>
            </nav>

            <section className="content">
                {activeLink === "browse" && <BrowseEvents/>}
                {activeLink === "tickets" && <Tickets/>}
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