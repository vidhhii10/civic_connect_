/**
 * Utility to export civic issue data to structured CSV with proper escaping and UTF-8 encoding
 */
export function exportIssuesToCSV(issues, customFilename) {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = customFilename || `civic_connect_ward_r_south_report_${dateStr}.csv`;

  const headers = [
    "Ticket ID",
    "Category",
    "Status",
    "Priority",
    "Department",
    "Assigned Officer",
    "Address",
    "Latitude",
    "Longitude",
    "Reporter Name",
    "Contact Phone",
    "Reported Date",
    "Progress",
    "Official Admin Notes",
    "Description"
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = issues.map((issue) => {
    const formattedDate = new Date(issue.timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    return [
      escapeCSV(issue.id),
      escapeCSV(issue.category),
      escapeCSV(issue.status),
      escapeCSV(issue.priority || "Medium"),
      escapeCSV(issue.department || "General Municipal"),
      escapeCSV(issue.assignedOfficer || "Unassigned"),
      escapeCSV(issue.address),
      escapeCSV(issue.latitude),
      escapeCSV(issue.longitude),
      escapeCSV(issue.reporterName || "Anonymous"),
      escapeCSV(issue.contact || "—"),
      escapeCSV(formattedDate),
      escapeCSV(`${issue.percentage ?? 0}%`),
      escapeCSV(issue.adminNotes || "None"),
      escapeCSV(issue.description || "")
    ];
  });

  // UTF-8 BOM (\uFEFF) ensures Excel and Numbers render characters accurately
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
