import { useState, useEffect } from "react";
import "./Announcement_List.css";
import EditAnnouncementModal from "./EditAnnouncementModal";

export default function Announcement_List() {
  const [announcements, setAnnouncements] = useState([]);
  const [archivedAnnouncements, setArchivedAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentPageCurrent, setCurrentPageCurrent] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 5;

  const openEditModal = (id) => {
    fetchAnnouncementById(id);
    setIsModalOpen(true);
  };

  const fetchAnnouncementById = async (id) => {
    try {
      const response = await fetch(
        `https://capstone-project0001-2.onrender.com/fetch-announcement-byID/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch announcement details");

      const data = await response.json();
      setSelectedAnnouncement(data);
    } catch (error) {
      console.error("Error fetching announcement by ID:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        "https://capstone-project0001-2.onrender.com/fetch-announcements"
      );
      if (!response.ok) throw new Error("Failed to fetch announcements");

      const data = await response.json();
      setAnnouncements(
        data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      );
    } catch (error) {
      console.error("Error fetching active announcements:", error);
    }
  };

  const fetchArchiveAnnouncements = async () => {
    try {
      const response = await fetch(
        "https://capstone-project0001-2.onrender.com/fetch-archived-announcements"
      );
      if (!response.ok)
        throw new Error("Failed to fetch archived announcements");

      const data = await response.json();
      setArchivedAnnouncements(
        data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      );
    } catch (error) {
      console.error("Error fetching archived announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchArchiveAnnouncements();
  }, []);

  const currentDate = new Date().toISOString().split("T")[0];

  const upcomingEvents = announcements.filter((a) => {
    const publishDate = new Date(a.publishDate).toISOString().split("T")[0];
    const endDate = new Date(a.endDate).toISOString().split("T")[0];
    return publishDate > currentDate && endDate > currentDate;
  });
  const currentEvents = announcements.filter((a) => {
    const publishDate = new Date(a.publishDate).toISOString().split("T")[0];
    const endDate = new Date(a.endDate).toISOString().split("T")[0];
    return publishDate <= currentDate && endDate >= currentDate;
  });

  const filteredAnnouncements = (list) =>
    list.filter(
      (a) =>
        a.title.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        a.audience.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const paginatedUpcomingEvents = () =>
    filteredAnnouncements(upcomingEvents).slice(
      (currentPageUpcoming - 1) * itemsPerPage,
      currentPageUpcoming * itemsPerPage
    );

  const paginatedCurrentEvents = () =>
    filteredAnnouncements(currentEvents).slice(
      (currentPageCurrent - 1) * itemsPerPage,
      currentPageCurrent * itemsPerPage
    );

  const paginatedArchivedEvents = () =>
    filteredAnnouncements(archivedAnnouncements).slice(
      (currentPageArchived - 1) * itemsPerPage,
      currentPageArchived * itemsPerPage
    );

  const handlePageChangeUpcoming = (page) => setCurrentPageUpcoming(page);
  const handlePageChangeCurrent = (page) => setCurrentPageCurrent(page);
  const handlePageChangeArchived = (page) => setCurrentPageArchived(page);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatAudience = (audience) =>
    audience === "all_cellgroups" ? "All Cellgroup" : "Network Leader";

  const renderAnnouncements = (announcements, showActions = true) => {
    if (announcements.length === 0)
      return (
        <tr>
          <td colSpan="6">No announcements available</td>
        </tr>
      );
    return announcements.map((announcement, index) => (
      <tr key={index}>
        <td>{announcement.title}</td>
        <td>{formatAudience(announcement.audience)}</td>
        <td>{formatDate(announcement.publishDate)}</td>
        <td>{formatDate(announcement.endDate)}</td>
        {showActions && (
          <>
            <td>
              <button
                className="edit_button"
                onClick={() => openEditModal(announcement._id)}
              >
                Edit
              </button>
            </td>
            <td>
              <button
                className="archive_button"
                onClick={() => archiveAnnouncement(announcement._id)}
              >
                Archive
              </button>
            </td>
          </>
        )}
      </tr>
    ));
  };

  const renderPagination = (list, currentPage, handlePageChange) => {
    const totalPages = Math.ceil(list.length / itemsPerPage);
    return (
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page_button ${i + 1 === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  const handleSaveAnnouncement = async (updatedAnnouncement) => {
    try {
      const response = await fetch(
        `https://capstone-project0001-2.onrender.com/update-announcement/${updatedAnnouncement._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAnnouncement),
        }
      );
      if (!response.ok) throw new Error("Failed to update announcement");

      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann._id === updatedAnnouncement._id ? updatedAnnouncement : ann
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  const archiveAnnouncement = async (id) => {
    const announcementToArchive = announcements.find((ann) => ann._id === id);

    setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));

    setArchivedAnnouncements((prev) => [announcementToArchive, ...prev]);

    try {
      const response = await fetch(
        `https://capstone-project0001-2.onrender.com/archive-announcement/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to archive announcement");
    } catch (error) {
      console.error("Error archiving announcement:", error);
      setAnnouncements((prev) => [...prev, announcementToArchive]);
      setArchivedAnnouncements((prev) =>
        prev.filter((ann) => ann._id !== announcementToArchive._id)
      );
    }
  };

  return (
    <div className="announcement_list_mainContainer">
      <div className="announcement_header_container">
        <p className="communication_church_name">
          CHRISTIAN BIBLE CHURCH OF HAGONOY
        </p>
        <h2 className="communication_header_Lbl">Announcement Lists</h2>
      </div>

      <div className="search_container">
        <input
          type="text"
          placeholder="Search by title or audience"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="announcement_list_body_container">
        <h3>Upcoming Events</h3>
        <table className="announcement_table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Audience</th>
              <th>Date Publish</th>
              <th>Date End</th>
              <th>Edit</th>
              <th>Archive</th>
            </tr>
          </thead>
          <tbody>{renderAnnouncements(paginatedUpcomingEvents())}</tbody>
        </table>
        {renderPagination(
          upcomingEvents,
          currentPageUpcoming,
          handlePageChangeUpcoming
        )}

        <h3>Current Events</h3>
        <table className="announcement_table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Audience</th>
              <th>Date Publish</th>
              <th>Date End</th>
              <th>Edit</th>
              <th>Archive</th>
            </tr>
          </thead>
          <tbody>{renderAnnouncements(paginatedCurrentEvents())}</tbody>
        </table>
        {renderPagination(
          currentEvents,
          currentPageCurrent,
          handlePageChangeCurrent
        )}

        <h3>Archived Events</h3>
        <table className="announcement_table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Audience</th>
              <th>Date Publish</th>
              <th>Date End</th>
            </tr>
          </thead>
          <tbody>{renderAnnouncements(paginatedArchivedEvents(), false)}</tbody>
        </table>
        {renderPagination(
          archivedAnnouncements,
          currentPageArchived,
          handlePageChangeArchived
        )}
      </div>

      {isModalOpen && selectedAnnouncement && (
        <EditAnnouncementModal
          isOpen={isModalOpen}
          announcement={selectedAnnouncement}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAnnouncement}
        />
      )}
    </div>
  );
}
