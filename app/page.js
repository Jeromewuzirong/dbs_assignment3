"use client";

import { useAssignments } from "./context/AssignmentContext";
import { useRouter } from "next/navigation";

function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
}

function dueDateColor(dateStr) {
  const days = daysUntil(dateStr);
  if (days <= 3) return "text-red-600";
  if (days <= 7) return "text-amber-600";
  return "text-green-600";
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const priorityBadge = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-50 text-green-700",
};

const statusLabel = {
  todo: "To do",
  done: "Done",
};

const statusBadge = {
  todo: "bg-gray-100 text-gray-600",
  done: "bg-green-50 text-green-700",
};

export default function Home() {
  const { assignments, updateAssignment } = useAssignments();
  const router = useRouter();

  const sorted = [...assignments].sort((a, b) => {
    const aDone = a.status === "done" ? 1 : 0;
    const bDone = b.status === "done" ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const urgentCount = assignments.filter(
    (a) => daysUntil(a.dueDate) <= 3 && a.status !== "done"
  ).length;

  function toggleDone(e, assignment) {
    e.stopPropagation();
    updateAssignment(assignment.id, {
      status: assignment.status === "done" ? "todo" : "done",
    });
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-lg">No assignments yet</p>
        <p className="text-sm mt-1">
          Click <span className="font-medium text-gray-600">Add Assignment</span> to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">All Assignments</h1>
        <button
          onClick={() => router.push("/add")}
          className="mt-2 px-4 py-1.5 text-base bg-gray-900 text-white rounded-md hover:bg-gray-800 cursor-pointer transition-colors"
        >
          + Add
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {assignments.length} assignment{assignments.length !== 1 && "s"}
        {urgentCount > 0 && (
          <span className="text-red-600 ml-1">
            &middot; {urgentCount} urgent
          </span>
        )}
      </p>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="pl-4 pr-2 py-2 w-10"></th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Course</th>
              <th className="px-3 py-2">Due Date</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((a) => (
              <tr
                key={a.id}
                onClick={() => router.push(`/assignment/${a.id}`)}
                className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="pl-4 pr-2 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={a.status === "done"}
                    onChange={(e) => toggleDone(e, a)}
                    className="h-4 w-4 rounded border-gray-300 accent-gray-800 cursor-pointer"
                  />
                </td>
                <td className={`px-3 py-3 font-medium ${a.status === "done" ? "line-through text-gray-400" : ""}`}>
                  {a.title}
                </td>
                <td className="px-3 py-3 text-gray-600">{a.course}</td>
                <td className={`px-3 py-3 ${dueDateColor(a.dueDate)}`}>
                  {formatDate(a.dueDate)}
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${priorityBadge[a.priority]}`}>
                    {a.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusBadge[a.status]}`}>
                    {statusLabel[a.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
