"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAssignments, isOverdue } from "./context/AssignmentContext";

function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
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
  todo: "bg-blue-50 text-blue-700",
  done: "bg-green-50 text-green-700",
};

const sampleAssignments = [
  {
    id: "sample-1",
    title: "Distributed Systems reflection",
    course: "MPCS 51230",
    dueDate: "2026-04-24",
    priority: "high",
    status: "todo",
    description:
      "Draft a short reflection and review notes from this week's lecture.",
  },
  {
    id: "sample-2",
    title: "Algorithms problem set",
    course: "CMSC 27200",
    dueDate: "2026-04-27",
    priority: "medium",
    status: "todo",
    description:
      "Finish the dynamic programming questions before office hours.",
  },
  {
    id: "sample-3",
    title: "Database reading notes",
    course: "MPCS 53111",
    dueDate: "2026-04-30",
    priority: "low",
    status: "todo",
    description:
      "Capture key points from the paper and flag anything to ask in class.",
  },
];

function StatCard({ label, value, tone = "default" }) {
  const toneClass = {
    default: "text-gray-900",
    urgent: "text-red-600",
    done: "text-emerald-700",
  };

  return (
    <div className="surface-card rounded-3xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${toneClass[tone]}`}>{value}</p>
    </div>
  );
}

function AssignmentCard({ assignment, onOpen, sample = false, onToggle }) {
  const overdue = isOverdue(assignment.dueDate, assignment.status);

  return (
    <article
      className={`surface-card rounded-3xl p-5 ${sample ? "" : "cursor-pointer hover:-translate-y-0.5"}`}
      onClick={sample ? undefined : onOpen}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
              {assignment.course}
            </span>
            {sample && (
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
                Sample preview
              </span>
            )}
          </div>
          <h2
            className={`mt-3 text-xl font-semibold ${
              assignment.status === "done"
                ? "text-gray-400 line-through"
                : "text-gray-900"
            }`}
          >
            {assignment.title}
          </h2>
          {assignment.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              {assignment.description}
            </p>
          )}
        </div>

        {!sample && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle(event);
            }}
            className={`rounded-full px-3 py-2 text-sm font-medium ${
              assignment.status === "done"
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {assignment.status === "done" ? "Marked done" : "Mark done"}
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
        <span
          className={`rounded-full px-3 py-1 font-medium ${
            overdue ? "bg-red-100 text-red-700" : priorityBadge[assignment.priority]
          }`}
        >
          {overdue ? "Overdue" : assignment.priority}
        </span>
        <span
          className={`rounded-full px-3 py-1 font-medium ${
            statusBadge[assignment.status]
          }`}
        >
          {statusLabel[assignment.status]}
        </span>
        <span
          className={`rounded-full px-3 py-1 ${
            assignment.status === "done"
              ? "bg-gray-100 text-gray-500"
              : overdue
                ? "bg-red-50 text-red-700"
                : "bg-white text-gray-600"
          }`}
        >
          Due {formatDate(assignment.dueDate)}
        </span>
      </div>
    </article>
  );
}

export default function Home() {
  const { assignments, updateAssignment, loading } = useAssignments();
  const router = useRouter();

  const sorted = [...assignments].sort((a, b) => {
    const aOverdue = isOverdue(a.dueDate, a.status) ? 0 : 1;
    const bOverdue = isOverdue(b.dueDate, b.status) ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    const aDone = a.status === "done" ? 1 : 0;
    const bDone = b.status === "done" ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const urgentCount = assignments.filter(
    (assignment) =>
      daysUntil(assignment.dueDate) <= 3 && assignment.status !== "done"
  ).length;

  function toggleDone(event, assignment) {
    event.stopPropagation();
    updateAssignment(assignment.id, {
      status: assignment.status === "done" ? "todo" : "done",
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <section className="surface-card rounded-[2rem] p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-orange-600">
            DDL Tracker
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-gray-900">
            Loading your dashboard...
          </h1>
        </section>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="surface-card h-28 animate-pulse rounded-3xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="surface-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
              DDL Tracker
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              A deadline dashboard that feels made for students, not spreadsheets.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              Keep courses, reading, labs, and due dates in one place. Start
              with a quick assignment, then use courses and books to organize
              the rest of your semester.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/add"
              className="inline-flex items-center rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
            >
              Add Assignment
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Assignments" value={assignments.length} />
        <StatCard
          label="Urgent this week"
          value={urgentCount}
          tone={urgentCount > 0 ? "urgent" : "default"}
        />
        <StatCard
          label="Completed"
          value={
            assignments.filter((assignment) => assignment.status === "done")
              .length
          }
          tone="done"
        />
      </section>

      {assignments.length === 0 ? (
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Starter preview
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                New visitors should see how the dashboard works right away.
                These sample cards are a preview only and are not saved to your
                account.
              </p>
            </div>

            {sampleAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} sample />
            ))}
          </div>

          <aside className="surface-card rounded-[2rem] p-6">
            <h2 className="text-xl font-semibold text-gray-900">Start here</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Your personal dashboard is empty, but the next step should be
              obvious.
            </p>
            <div className="mt-5 space-y-3">
              <Link
                href="/add"
                className="flex items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
              >
                Create your first assignment
              </Link>
              <Link
                href="/books"
                className="flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Explore textbook search
              </Link>
            </div>
            <div className="mt-6 space-y-4 text-sm text-gray-600">
              <div className="rounded-2xl bg-white p-4">
                <p className="font-medium text-gray-900">1. Add one real deadline</p>
                <p className="mt-1">
                  Use the form to capture a course, title, due date, and short
                  description.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="font-medium text-gray-900">
                  2. Track progress visually
                </p>
                <p className="mt-1">
                  Assignments surface by urgency, and completed work stays
                  visible without cluttering the page.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="font-medium text-gray-900">3. Organize the rest</p>
                <p className="mt-1">
                  Courses group related work, and books gives you a reading list
                  from the Open Library API.
                </p>
              </div>
            </div>
          </aside>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                All Assignments
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Ordered by urgency so the next thing to do is always visible.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/add")}
              className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
            >
              Add another assignment
            </button>
          </div>

          <div className="space-y-4">
            {sorted.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onOpen={() => router.push(`/assignment/${assignment.id}`)}
                onToggle={(event) => toggleDone(event, assignment)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
