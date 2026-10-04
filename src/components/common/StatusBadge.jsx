import React from "react";
import { Clock, RefreshCw, CheckCircle2 } from "lucide-react";

export default function StatusBadge({ status }) {
  const norm = (status || "Pending").toLowerCase();

  if (norm.includes("completed") || norm.includes("resolved")) {
    return (
      <span className="badge badge-completed">
        <CheckCircle2 size={12} />
        <span>Completed</span>
      </span>
    );
  }

  if (norm.includes("progress")) {
    return (
      <span className="badge badge-progress">
        <RefreshCw size={12} className="spin-slow" />
        <span>In Progress</span>
      </span>
    );
  }

  return (
    <span className="badge badge-pending">
      <Clock size={12} />
      <span>Pending</span>
    </span>
  );
}
