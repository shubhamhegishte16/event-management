import { CalendarDays, Clock, MapPin, Ticket, X, Download, Eye, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import "./UserDashboard.css";

const ticketsData = [
    {
        id: 1,
        eventName: "Neon Nights Music Fest",
        date: "Jun 28, 2026",
        time: "7:00 PM",
        venue: "Skyline Arena, Mumbai",
        ticketType: "VIP Pass",
        bookingId: "NX12345",
        status: "Upcoming",
        price: "₹ 2,499",
        seatNumber: "A-12",
        gateNumber: "Gate 1",
    },
    {
        id: 2,
        eventName: "Startup Connect 2026",
        date: "Jul 04, 2026",
        time: "10:00 AM",
        venue: "NexHub Convention Centre",
        ticketType: "Standard Pass",
        bookingId: "NX54321",
        status: "Upcoming",
        price: "₹ 1,499",
        seatNumber: "H-45",
        gateNumber: "Main Gate",
    },
    {
        id: 3,
        eventName: "The Grand Food Carnival",
        date: "Jul 12, 2026",
        time: "12:00 PM",
        venue: "Riverfront Grounds",
        ticketType: "Foodie Pass",
        bookingId: "FC88992",
        status: "Upcoming",
        price: "₹ 899",
        seatNumber: "General",
        gateNumber: "North Entry",
    },
    {
        id: 4,
        eventName: "Designers After Dark",
        date: "Jul 18, 2026",
        time: "6:30 PM",
        venue: "Art House Studio",
        ticketType: "Creative Pass",
        bookingId: "DS77123",
        status: "Past",
        price: "₹ 599",
        seatNumber: "Studio A",
        gateNumber: "Main Entrance",
    },
    {
        id: 5,
        eventName: "Comedy House Live",
        date: "Jul 25, 2026",
        time: "8:30 PM",
        venue: "Laugh Loft Theatre",
        ticketType: "Premium Seat",
        bookingId: "CH44567",
        status: "Cancelled",
        price: "₹ 999",
        seatNumber: "Row C-8",
        gateNumber: "West Wing",
    },
];

export default function Tickets() {
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [selectedTicket, setSelectedTicket] = useState(null);

    const filteredTickets = useMemo(() => {
        return ticketsData.filter((ticket) => ticket.status === activeTab);
    }, [activeTab]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Upcoming":
                return "status-upcoming";
            case "Past":
                return "status-past";
            case "Cancelled":
                return "status-cancelled";
            default:
                return "";
        }
    };

    return (
        <>
            <section className="tickets-hero">
                <div>
                    <h2>My Tickets</h2>
                    <p>Manage, view, and download tickets for all your upcoming events.</p>
                </div>
            </section>

            <div className="tickets-container">
                <div className="ticket-tabs">
                    <div className="ticket-status">
                        <button
                            className={`tab-btn ${activeTab === "Upcoming" ? "active" : ""}`}
                            onClick={() => setActiveTab("Upcoming")}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "Past" ? "active" : ""}`}
                            onClick={() => setActiveTab("Past")}
                        >
                            Past
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "Cancelled" ? "active" : ""}`}
                            onClick={() => setActiveTab("Cancelled")}
                        >
                            Cancelled
                        </button>
                    </div>
                    <span className="row-heading tab-count">
                        {ticketsData.filter((t) => t.status === activeTab).length} events
                    </span>
                </div>

                {filteredTickets.length > 0 ? (
                    <div className="tickets-list">
                        {filteredTickets.map((ticket) => (
                            <article className="ticket-card" key={ticket.id}>
                                <div className="ticket-card-header">
                                    <div className="event-category">{ticket.ticketType}</div>
                                    <span className={`status-badge ${getStatusBadgeClass(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <h3 className="ticket-event-name">{ticket.eventName}</h3>
                                <div className="ticket-info-grid">
                                    <div className="ticket-info-item">
                                        <CalendarDays size={16} />
                                        <span>{ticket.date}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <Clock size={16} />
                                        <span>{ticket.time}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <MapPin size={16} />
                                        <span>{ticket.venue}</span>
                                    </div>
                                </div>
                                <div className="ticket-booking-id">
                                    <Ticket size={14} />
                                    <span>Booking ID: {ticket.bookingId}</span>
                                </div>
                                <div className="ticket-card-actions">
                                    <button
                                        className="btn-view-ticket"
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <Eye size={16} />
                                        View Ticket
                                    </button>
                                    {ticket.status === "Upcoming" && (
                                        <button
                                            className="btn-download-ticket"
                                            onClick={() => handleDownloadPDF(ticket)}
                                        >
                                            <Download size={16} />
                                            Download
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-tickets">
                        <Ticket size={48} />
                        <h3>No {activeTab.toLowerCase()} tickets found</h3>
                        <p>You don't have any {activeTab.toLowerCase()} tickets in your collection.</p>
                    </div>
                )}
            </div>

            {selectedTicket && (
                <div className="ticket-modal-overlay" onClick={() => setSelectedTicket(null)}>
                    <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="ticket-modal-close"
                            onClick={() => setSelectedTicket(null)}
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                        <div className="ticket-modal-header">
                            <div className="event-visual-preview">
                                <span>{selectedTicket.ticketType}</span>
                            </div>
                            <h2>{selectedTicket.eventName}</h2>
                            <p className="ticket-modal-summary">
                                Official entry pass • Valid for one person
                            </p>
                        </div>
                        <div className="ticket-modal-details">
                            <div className="detail-row">
                                <CalendarDays size={18} />
                                <div>
                                    <strong>Date & Time</strong>
                                    <span>{selectedTicket.date} at {selectedTicket.time}</span>
                                </div>
                            </div>
                            <div className="detail-row">
                                <MapPin size={18} />
                                <div>
                                    <strong>Venue</strong>
                                    <span>{selectedTicket.venue}</span>
                                </div>
                            </div>
                            <div className="detail-row">
                                <Ticket size={18} />
                                <div>
                                    <strong>Ticket Type</strong>
                                    <span>{selectedTicket.ticketType} • {selectedTicket.price}</span>
                                </div>
                            </div>
                        </div>
                        <div className="qr-code-section">
                            <div className="qr-container">
                                <QRCode value={selectedTicket.bookingId} size={140} bgColor="#FFFFFF" fgColor="#FF8A3D" />
                            </div>
                            <div className="booking-id-display">
                                <strong>Booking ID</strong>
                                <code>{selectedTicket.bookingId}</code>
                            </div>
                            {selectedTicket.seatNumber && (
                                <div className="seat-info">
                                    Seat: {selectedTicket.seatNumber} | Gate: {selectedTicket.gateNumber}
                                </div>
                            )}
                        </div>
                        <div className="ticket-modal-footer">
                            <button
                                className="btn-download-pdf"
                                onClick={() => {
                                    handleDownloadPDF(selectedTicket);
                                    setSelectedTicket(null);
                                }}
                            >
                                <Download size={16} />
                                Download PDF Ticket
                            </button>
                            <button className="btn-close-modal" onClick={() => setSelectedTicket(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}