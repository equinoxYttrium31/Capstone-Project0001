import { useState, useEffect } from "react";
import "./Announcement_List.css";
import ConfirmationModal from "./confirmationModal/ConfirmationModal";
import { xlsx_icon } from "../../assets/Images";
import EditAnnouncementModal from "./EditAnnouncementModal";
import ExcelJS from "exceljs";

export default function Announcement_List() {
  const [announcements, setAnnouncements] = useState([]);
  const [archivedAnnouncements, setArchivedAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentPageCurrent, setCurrentPageCurrent] = useState(1);
  const [currentPageArchived, setCurrentPageArchived] = useState(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncementToArchive, setSelectedAnnouncementToArchive] =
    useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

    // Show confirmation modal
    setSelectedAnnouncementToArchive(announcementToArchive);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (!selectedAnnouncementToArchive) return;

    const announcementToArchive = selectedAnnouncementToArchive;

    setAnnouncements((prev) =>
      prev.filter((ann) => ann._id !== announcementToArchive._id)
    );
    setArchivedAnnouncements((prev) => [announcementToArchive, ...prev]);

    try {
      const response = await fetch(
        `https://capstone-project0001-2.onrender.com/archive-announcement/${announcementToArchive._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to archive announcement");
    } catch (error) {
      console.error("Error archiving announcement:", error);
      // Revert changes if error occurs
      setAnnouncements((prev) => [...prev, announcementToArchive]);
      setArchivedAnnouncements((prev) =>
        prev.filter((ann) => ann._id !== announcementToArchive._id)
      );
    }

    setIsConfirmModalOpen(false); // Close the confirmation modal after archiving
  };

  const handleCancelArchive = () => {
    setSelectedAnnouncementToArchive(null); // Reset the selected announcement
    setIsConfirmModalOpen(false); // Close the modal if canceled
  };

  const handleExportToExcel = () => {
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const simplifyAnnouncement = (announcement) => ({
      title: announcement.title,
      audience: announcement.audience,
      publishDate: formatDate(announcement.publishDate),
      endDate: formatDate(announcement.endDate),
    });

    const upcomingAnnouncementsSimplified = (upcomingEvents || []).map(
      simplifyAnnouncement
    );
    const currentAnnouncementsSimplified = (currentEvents || []).map(
      simplifyAnnouncement
    );
    const archivedAnnouncementsSimplified = (archivedAnnouncements || []).map(
      simplifyAnnouncement
    );

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Function to add a worksheet and populate data
    const addWorksheet = (worksheetName, announcements) => {
      const worksheet = workbook.addWorksheet(worksheetName);

      // Title row
      worksheet.addRow([
        `CHRISTIAN BIBLE CHURCH OF HAGONOY - ${worksheetName}`,
      ]);
      const titleRow = worksheet.getRow(1);
      titleRow.font = { bold: true, size: 16 };
      titleRow.alignment = { horizontal: "center" };
      worksheet.mergeCells("A1:D1");

      // Header row (row 2)
      worksheet.addRow(["Title", "Audience", "Publish Date", "End Date"]);
      const headerRow = worksheet.getRow(2);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Set column widths
      worksheet.columns = [
        { key: "title", width: 30 },
        { key: "audience", width: 20 },
        { key: "publishDate", width: 20 },
        { key: "endDate", width: 20 },
      ];

      let lastDataRowNumber;

      // Data rows start from row 3
      if (announcements.length > 0) {
        announcements.forEach((announcement, index) => {
          const row = worksheet.addRow(announcement);
          lastDataRowNumber = row.number; // Update to the latest data row number

          row.height = 45;
          // Alternate row colors
          if (index % 2 === 0) {
            row.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F2F2F2" },
              };
            });
          }

          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.alignment = {
              horizontal: "left",
              vertical: "middle",
              wrapText: true,
            };
          });
        });
      } else {
        // If no announcements, display a single row with "No Announcements"
        const noAnnouncementsRow = worksheet.addRow(["No Announcements"]);
        noAnnouncementsRow.font = { italic: true };
        noAnnouncementsRow.alignment = { horizontal: "center" };
        worksheet.mergeCells(`A3:D3`);
        lastDataRowNumber = noAnnouncementsRow.number; // Assign the row number of "No Announcements"
      }
      worksheet.addRow([]);

      // Footer row (current date)
      const footerRow = worksheet.addRow([
        `Generated on: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
      ]);

      footerRow.font = { italic: true };
      footerRow.alignment = { horizontal: "right" };

      // Merge cells A-D in the footer row
      worksheet.mergeCells(`A${footerRow.number}:D${footerRow.number}`);
    };

    // Add worksheets for each category
    addWorksheet("Upcoming Announcements", upcomingAnnouncementsSimplified);
    addWorksheet("Current Announcements", currentAnnouncementsSimplified);
    addWorksheet("Archived Announcements", archivedAnnouncementsSimplified);

    // Write the Excel file to the browser
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Announcements.xlsx";
        link.click();
      })
      .catch((err) => console.error("Error exporting to Excel:", err));
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
        <button className="export_button" onClick={handleExportToExcel}>
          <img src={xlsx_icon} alt="" className="expport_icon" />
          Export
        </button>
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

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmArchive}
        onCancel={handleCancelArchive}
        message={`Are you sure you want to archive this announcement?`}
      />
    </div>
  );
}
