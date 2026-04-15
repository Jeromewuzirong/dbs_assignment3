"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAssignments as fetchFromDb,
  addAssignmentAction,
  updateAssignmentAction,
} from "../actions";

const AssignmentContext = createContext();

export function isOverdue(dueDate, status) {
  if (status === "done") return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  return due < now;
}

export function calcPriority(dueDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (days < 0) return "high";
  if (days <= 1) return "high";
  if (days <= 3) return "medium";
  return "low";
}

function rowToAssignment(row) {
  return {
    id: row.id,
    course: row.course,
    title: row.title,
    dueDate: row.due_date,
    description: row.description,
    priority: row.priority,
    status: row.status,
  };
}

export function AssignmentProvider({ children }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const rows = await fetchFromDb();
      setAssignments(rows.map(rowToAssignment));
    } catch (err) {
      console.error("Failed to load assignments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addAssignment(assignment) {
    const priority = calcPriority(assignment.dueDate);
    await addAssignmentAction({
      course: assignment.course,
      title: assignment.title,
      due_date: assignment.dueDate,
      description: assignment.description,
      priority,
      status: "todo",
    });
    await refresh();
  }

  async function updateAssignment(id, updates) {
    const dbUpdates = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.course !== undefined) dbUpdates.course = updates.course;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    await updateAssignmentAction(id, dbUpdates);
    await refresh();
  }

  return (
    <AssignmentContext.Provider
      value={{ assignments, addAssignment, updateAssignment, loading }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error("useAssignments must be used within an AssignmentProvider");
  }
  return context;
}
