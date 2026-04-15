# DDL Tracker

A deadline tracking app for a graduate student (UChicago MPCS).

This project started as Assignment 2 and is now being extended for Assignment 3.
The goal is to keep as much of the current UI and structure as possible while upgrading it into a full-stack app.

## Assignment 3 Goal

Convert this project into a full-stack app that includes:

- Clerk authentication (sign up, log in, sign out)
- Supabase database
- User-specific data scoped to the logged-in user
- One external API integration
- A flow where users can browse/search data, save items, and view saved items
- Deployment to Vercel

Claude should prioritize the minimum viable implementation needed to satisfy the assignment.

## Current App Concept

DDL Tracker is a deadline tracking app for a graduate student.
It currently focuses on tracking assignments and deadlines across courses.

## Style

Notion-inspired. Clean white, generous whitespace, minimal borders, table-based layout.

## Current Pages

- `/` — Homepage, all assignments sorted by due date, color-coded urgency
- `/add` — Form to add a new assignment
- `/assignment/[id]` — Dynamic route, assignment detail, mark as complete
- `/courses` — Assignments grouped by course with progress per course

## Current Data Model

The original Assignment 2 version used client-side React context.

Fields:
- `id`: string
- `course`: string
- `title`: string
- `dueDate`: string (ISO date)
- `description`: string
- `priority`: high | medium | low
- `status`: todo | done

## Assignment 3 Direction

For Assignment 3, Claude should help transform this into a real multi-user app.

Preferred direction:
- Keep the DDL Tracker concept
- Replace client-side-only storage with Supabase
- Scope assignments to the logged-in user
- Add an external API that fits the student/deadline workflow
- Preserve the existing UI where possible
- Make small, safe, incremental changes

## Rules for Claude

- Explain the plan before coding
- Prefer small, safe changes over large rewrites
- Reuse the current pages and components where possible
- Do not hardcode secrets or API keys
- Use environment variables
- Only create new files when necessary
- Keep the implementation realistic for a class assignment
- Focus on shipping a working minimum viable product