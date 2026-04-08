"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignments } from "../context/AssignmentContext";

const inputClass =
  "w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors";

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

  function handleSubmit(e) {
    e.preventDefault();
    addAssignment({
      course: form.course,
      title: form.title,
      dueDate: form.dueDate,
      description: form.description,
    });
    router.push("/");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Assignment</h1>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Course
          </label>
          <input
            type="text"
            required
            placeholder="e.g. MPCS 51238"
            value={form.course}
            onChange={(e) => update("course", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Title
          </label>
          <input
            type="text"
            required
            placeholder="Assignment title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Due Date
          </label>
          <input
            type="date"
            lang="en"
            required
            value={form.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Details about the assignment..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={inputClass + " resize-none"}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 cursor-pointer transition-colors"
          >
            Add Assignment
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
