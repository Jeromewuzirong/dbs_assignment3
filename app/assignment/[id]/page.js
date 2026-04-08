"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAssignments, isOverdue } from "../../context/AssignmentContext";

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const priorityBadge = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-gray-100 text-gray-600",
};

const statusBadge = {
  todo: "bg-gray-100 text-gray-600",
  done: "bg-green-50 text-green-700",
};

const statusLabel = {
  todo: "To do",
  done: "Done",
};

export default function AssignmentDetail({ params }) {
  const { id } = use(params);
  const { assignments, updateAssignment } = useAssignments();
  const router = useRouter();

  const assignment = assignments.find((a) => a.id === id);

  if (!assignment) {
    return (
      <div className="py-32 text-center text-gray-400">
        <p className="text-lg">Assignment not found</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          &larr; Back to home
        </button>
      </div>
    );
  }

  const isDone = assignment.status === "done";
  const overdue = isOverdue(assignment.dueDate, assignment.status);

  function toggleDone() {
    updateAssignment(id, { status: isDone ? "todo" : "done" });
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.push("/")}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 inline-block cursor-pointer"
      >
        &larr; Back to home
      </button>

      <h1 className="text-2xl font-bold mb-1">{assignment.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{assignment.course}</p>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</span>
          <span className={`text-sm ${overdue ? "text-red-600 font-medium" : ""}`}>
            {overdue ? "Overdue" : formatDate(assignment.dueDate)}
          </span>
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</span>
          {overdue ? (
            <span className="px-2 py-0.5 rounded text-base font-bold bg-red-100 text-red-700 leading-5">
              &infin;
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityBadge[assignment.priority]}`}>
              {assignment.priority}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge[assignment.status]}`}>
            {statusLabel[assignment.status]}
          </span>
        </div>
      </div>

      {assignment.description && (
        <div className="mt-6">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h2>
          <p className="text-sm leading-relaxed text-gray-700">{assignment.description}</p>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={toggleDone}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            isDone
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {isDone ? "Reopen" : "Mark as done"}
        </button>
      </div>
    </div>
  );
}
