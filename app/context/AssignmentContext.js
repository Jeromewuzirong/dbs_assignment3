"use client";

import { createContext, useContext, useState } from "react";

const AssignmentContext = createContext();

export function calcPriority(dueDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (days <= 1) return "high";
  if (days <= 3) return "medium";
  return "low";
}

const sampleAssignments = [
  {
    id: "1",
    course: "MPCS 51238",
    title: "Large-Scale Data Analysis Final Project",
    dueDate: "2026-04-15",
    description:
      "Build an end-to-end data pipeline using Apache Spark to process and analyze a large dataset. Submit code, report, and presentation slides.",
    priority: "low",
    status: "todo",
  },
  {
    id: "2",
    course: "MPCS 51050",
    title: "OOP Design Patterns Homework 4",
    dueDate: "2026-04-12",
    description:
      "Implement the Observer and Strategy patterns in a simulated trading system. Include UML diagrams and unit tests.",
    priority: "medium",
    status: "todo",
  },
  {
    id: "3",
    course: "MPCS 55001",
    title: "Algorithms Problem Set 6",
    dueDate: "2026-04-20",
    description:
      "Solve problems on dynamic programming and graph algorithms. Provide proofs of correctness and runtime analysis.",
    priority: "low",
    status: "todo",
  },
  {
    id: "4",
    course: "MPCS 51238",
    title: "Data Analysis Reading Response",
    dueDate: "2026-04-10",
    description:
      "Write a 2-page response to the MapReduce paper. Discuss trade-offs and modern alternatives.",
    priority: "medium",
    status: "done",
  },
];

export function AssignmentProvider({ children }) {
  const [assignments, setAssignments] = useState(sampleAssignments);

  function addAssignment(assignment) {
    const priority = calcPriority(assignment.dueDate);
    setAssignments((prev) => [
      ...prev,
      { ...assignment, priority, status: "todo", id: Date.now().toString() },
    ]);
  }

  function updateAssignment(id, updates) {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }

  return (
    <AssignmentContext.Provider
      value={{ assignments, addAssignment, updateAssignment }}
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
