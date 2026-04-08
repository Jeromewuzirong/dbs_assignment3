# DDL Tracker

A deadline tracking app for a graduate student (UChicago MPCS).

## Style

Notion-inspired. Clean white, generous whitespace, minimal borders, table-based layout.

## Pages

- `/` — Homepage, all assignments sorted by due date, color-coded urgency
- `/add` — Form to add a new assignment
- `/assignment/[id]` — Dynamic route, assignment detail, mark as complete
- `/courses` — Assignments grouped by course with progress per course

## Data Model (client-side React context)

- `id`: string
- `course`: string
- `title`: string
- `dueDate`: string (ISO date)
- `description`: string
- `priority`: high | medium | low
- `status`: todo | done

## Sample Data

4 pre-loaded assignments on first load.
