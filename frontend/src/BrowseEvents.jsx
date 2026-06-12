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
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BrowseEvents.css";

export default function BrowseEvents({ onBackHome }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from backend - FIXED ENDPOINT
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/events/get-events");
        const data = await response.json();
        
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          console.error("Unexpected response:", data);
          setError("Failed to load events");
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const featuredRows = useMemo(() => [
    { title: "Trending Now", events: events.slice(0, 4) },
    { title: "Weekend Picks", events: [events[2], events[4], events[5], events[1]].filter(Boolean) },
    { title: "Because You Like Live Experiences", events: [events[0], events[3], events[1], events[5]].filter(Boolean) },
  ], [events]);

  const visibleRows = useMemo(() => {
    if (!query.trim()) return featuredRows;

    const lowerQuery = query.toLowerCase();
    const filteredEvents = events.filter((event) =>
      `${event.title} ${event.category} ${event.venue}`.toLowerCase().includes(lowerQuery)
    );

    return [{ title: "Search Results", events: filteredEvents }];
  }, [query, featuredRows, events]);

  const categoryClass = {
    "Technology": "concert",
    "Workshop": "business",
    "Sports": "sports",
    "Cultural": "design",
    "Business": "business",
    "Music": "concert",
    "Other": "concert",
  };

  const handleBookTicket = async () => {
    const token = localStorage.getItem("token");

    // If not logged in, send to login
    if (!token) {
      navigate("/login");
      return;
    }

    setBooking(true);

    try {
      const res = await fetch("http://localhost:5000/api/tickets/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: selectedEvent._id, quantity: 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingSuccess(true);
        // Update available tickets in the selected event
        setSelectedEvent(prev => ({
          ...prev,
          availableTickets: prev.availableTickets - 1
        }));
        // Update events list to reflect ticket reduction
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event._id === selectedEvent._id 
              ? { ...event, availableTickets: event.availableTickets - 1 }
              : event
          )
        );
        setTimeout(() => {
          setBookingSuccess(false);
          setSelectedEvent(null);
        }, 2000);
      } else {
        alert(data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display (assuming date includes time)
  const formatTime = (dateString) => {
    if (!dateString) return "Time TBD";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <main className="browse-page">
        <nav className="browse-nav">
          <button className="browse-brand" onClick={onBackHome} type="button">
            NexEvent
          </button>
          <div className="browse-nav-links">
            <Link to="/login">Login</Link>
            <Link className="signup-link" to="/signup">Sign Up</Link>
          </div>
        </nav>
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p>Loading events...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="browse-page">
        <nav className="browse-nav">
          <button className="browse-brand" onClick={onBackHome} type="button">
            NexEvent
          </button>
          <div className="browse-nav-links">
            <Link to="/login">Login</Link>
            <Link className="signup-link" to="/signup">Sign Up</Link>
          </div>
        </nav>
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ color: "red" }}>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </main>
    );
  }

  return (
    <main className="browse-page">
      <nav className="browse-nav">
        <button className="browse-brand" onClick={onBackHome} type="button">
          NexEvent
        </button>

        <div className="browse-nav-links">
          <button className="category-nav-button" onClick={() => navigate("/event-section")} type="button">
            Categories
            <ChevronDown size={16} />
          </button>
          <a href="#upcoming">Upcoming Events</a>
          <Link to="/login">Login</Link>
          <Link className="signup-link" to="/signup">Sign Up</Link>
        </div>
      </nav>

      <section className="browse-hero">
        <div>
          <p className="browse-kicker">Discover what's happening next</p>
          <h1>Browse events made for your next great plan.</h1>
          <p>
            Find concerts, conferences, food festivals, creative meetups, comedy nights,
            and sports events from organizers on NexEvent.
          </p>
        </div>
        <label className="search-shell">
          <Search size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events, venues, categories"
          />
        </label>
      </section>

      <section className="event-shelves" aria-label="Event collections">
        {events.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>No events available. Check back later!</p>
        ) : (
          visibleRows.map((row) => (
            <div className="event-row" key={row.title}>
              <div className="row-heading">
                <h2>{row.title}</h2>
                <span>{row.events.length} events</span>
              </div>
              {row.events.length > 0 ? (
                <div className="event-card-track">
                  {row.events.map((event) => (
                    <article
                      className="event-card"
                      key={`${row.title}-${event._id}`}
                      onClick={() => setSelectedEvent(event)}
                      onKeyDown={(keyEvent) => {
                        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                          keyEvent.preventDefault();
                          setSelectedEvent(event);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`event-visual ${categoryClass[event.category] || "concert"}`}>
                        <span>{event.category}</span>
                      </div>
                      <div className="event-card-body">
                        <h3>{event.title}</h3>
                        <p><CalendarDays size={15} />{formatDate(event.date)}</p>
                        <p><MapPin size={15} />{event.venue}</p>
                        <div className="event-card-meta">
                          <span>From ₹{event.price}</span>
                          <span><Star size={14} fill="currentColor" />{event.rating || "4.5"}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                          <Ticket size={12} /> {event.availableTickets} tickets left
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No events found. Try another search.</p>
              )}
            </div>
          ))
        )}
      </section>

      {selectedEvent && (
        <div className="event-popup-backdrop" onClick={() => setSelectedEvent(null)}>
          <section
            aria-modal="true"
            className="event-popup"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Close event details"
              className="event-popup-close"
              onClick={() => setSelectedEvent(null)}
              type="button"
            >
              <X size={18} />
            </button>

            <div className={`event-visual ${categoryClass[selectedEvent.category] || "concert"}`}>
              <span>{selectedEvent.category}</span>
            </div>

            <div className="event-popup-content">
              <p className="browse-kicker">Event details</p>
              <h2>{selectedEvent.title}</h2>
              <p className="event-popup-summary">
                {selectedEvent.description || `Join us for an exciting ${selectedEvent.category} event! ${selectedEvent.title} promises to be an unforgettable experience. Don't miss out on this amazing opportunity to connect, learn, and have fun.`}
              </p>

              <div className="event-popup-grid">
                <span><CalendarDays size={17} />{formatDate(selectedEvent.date)}</span>
                <span><Clock size={17} />{formatTime(selectedEvent.date)}</span>
                <span><MapPin size={17} />{selectedEvent.venue}</span>
                <span><Users size={17} />{selectedEvent.organizer?.name || "Event Organizer"}</span>
              </div>

              <div className="event-popup-booking">
                <div>
                  <span>Ticket price</span>
                  <strong>₹{selectedEvent.price}</strong>
                </div>
                <div>
                  <span>Available seats</span>
                  <strong>{selectedEvent.availableTickets} / {selectedEvent.totalTickets}</strong>
                </div>

                {bookingSuccess ? (
                  <button type="button" disabled style={{ background: "green" }}>
                    ✅ Booked!
                  </button>
                ) : (
                  <button
                    onClick={handleBookTicket}
                    type="button"
                    disabled={booking || selectedEvent.availableTickets === 0}
                    style={{
                      opacity: selectedEvent.availableTickets === 0 ? 0.5 : 1,
                      cursor: selectedEvent.availableTickets === 0 ? "not-allowed" : "pointer"
                    }}
                  >
                    <Ticket size={18} />
                    {selectedEvent.availableTickets === 0 
                      ? "Sold Out" 
                      : booking ? "Booking..." : "Book Ticket"}
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <footer className="browse-footer">
        <div>
          <strong>NexEvent</strong>
          <p>Discover, plan, and attend events with ease.</p>
        </div>
        <div className="footer-links">
          <a href="#about">About Us</a>
          <a href="#upcoming">Upcoming Events</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="footer-copy">© 2026 NexEvent. All rights reserved.</p>
      </footer>
    </main>
  );
}