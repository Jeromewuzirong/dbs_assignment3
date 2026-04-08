"use client";

import { useAssignments, isOverdue } from "../context/AssignmentContext";
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
  });
}

const statusLabel = {
  todo: "To do",
  done: "Done",
};

const statusBadge = {
  todo: "bg-blue-50 text-blue-700",
  done: "bg-green-50 text-green-700",
};

export default function Courses() {
  const { assignments } = useAssignments();
  const router = useRouter();

  const grouped = {};
  for (const a of assignments) {
    if (!grouped[a.course]) grouped[a.course] = [];
    grouped[a.course].push(a);
  }

  const courses = Object.keys(grouped).sort();

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-lg">No courses yet</p>
        <p className="text-sm mt-1">
          Assignments will be grouped here once you add them.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>

      <div className="space-y-8">
        {courses.map((course) => {
          const items = grouped[course].sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
          );
          const doneCount = items.filter((a) => a.status === "done").length;
          const pct = Math.round((doneCount / items.length) * 100);

          return (
            <section key={course}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold">{course}</h2>
                <span className="text-xs text-gray-500">
                  {doneCount} of {items.length} done
                </span>
              </div>

              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {items.map((a) => {
                      const overdue = isOverdue(a.dueDate, a.status);
                      return (
                        <tr
                          key={a.id}
                          onClick={() => router.push(`/assignment/${a.id}`)}
                          className={`border-t first:border-t-0 border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            overdue ? "bg-red-50" : ""
                          }`}
                        >
                          <td className={`px-4 py-3 font-medium ${a.status === "done" ? "line-through text-gray-400" : ""}`}>
                            {a.title}
                          </td>
                          <td className={`px-3 py-3 ${overdue ? "text-red-600 font-medium" : dueDateColor(a.dueDate)}`}>
                            {overdue ? "Overdue" : formatDate(a.dueDate)}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusBadge[a.status]}`}>
                              {statusLabel[a.status]}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
