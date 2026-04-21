"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignments } from "../context/AssignmentContext";

const inputClass =
  "w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100";

export default function AddAssignment() {
  const { addAssignment } = useAssignments();
  const router = useRouter();

  const [form, setForm] = useState({
    course: "",
    title: "",
    dueDate: "",
    description: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await addAssignment({
      course: form.course,
      title: form.title,
      dueDate: form.dueDate,
      description: form.description,
    });
    router.push("/");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-orange-600">
              New Assignment
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
              Add a deadline without the spreadsheet feel
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
              Capture the essentials now. You can return to the dashboard to
              mark work done or review assignment details.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Back to dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                Course
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MPCS 51238"
                value={form.course}
                onChange={(event) => update("course", event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                Due Date
              </label>
              <input
                type="date"
                lang="en"
                required
                value={form.dueDate}
                onChange={(event) => update("dueDate", event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="Assignment title"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Description
            </label>
            <textarea
              rows={5}
              placeholder="Details about the assignment, reading, lab, or deliverable..."
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
            >
              Save Assignment
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      <aside className="surface-card rounded-[2rem] p-6">
        <h2 className="text-xl font-semibold text-gray-900">What makes this useful</h2>
        <div className="mt-5 space-y-4 text-sm text-gray-600">
          <div className="rounded-2xl bg-white p-4">
            <p className="font-medium text-gray-900">Clear course labels</p>
            <p className="mt-1">
              Use the exact course code or short course name you recognize at a
              glance.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <p className="font-medium text-gray-900">Meaningful titles</p>
            <p className="mt-1">
              Name the deliverable, not just &quot;Homework,&quot; so the
              dashboard stays scannable later.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <p className="font-medium text-gray-900">Descriptions when needed</p>
            <p className="mt-1">
              A short note is enough for requirements, links, or what you need
              to finish next.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
