# UI/UX Design System & Experience Guidelines

This document establishes the design principles, visual aesthetics, typography, color harmony, layout guidelines, and micro-interaction standards for the University / College Management ERP.

---

## 1. Core Design Philosophy

1. **State-of-the-Art Visual Aesthetics**: Premium, modern, clean, and wows the user on first view. Avoids bland, dated table layouts.
2. **Cognitive Ease & High Information Density**: Complex multi-semester transcripts, fee breakdowns, and timetables are presented using scannable cards, collapsible accordions, and clean visual hierarchies.
3. **Role-Tailored Dashboards**: Each actor (Student, Teacher, Accountant, Admin) receives an interface tailored to their daily jobs to be done.

---

## 2. Color Palette & Theming

### Primary Theme Tokens
* **Brand Primary**: Deep Academic Navy (`#0F172A` / `#1E293B`)
* **Brand Accent**: Electric Indigo (`#6366F1` / `#4F46E5`)
* **Background Canvas**: Soft Platinum Neutral (`#F8FAFC` in Light Mode, `#090D16` in Dark Mode)
* **Surface Card**: Pristine White / Deep Slate Glass (`#FFFFFF` / `rgba(30, 41, 59, 0.8)`)
* **Border Lines**: Subtle Muted Stroke (`#E2E8F0` / `#334155`)

### Semantic State Colors
* **Success**: Emerald Green (`#10B981`) — Passed courses, paid challans, active memberships.
* **Warning**: Amber Glow (`#F59E0B`) — Academic probation, pending approvals, upcoming due dates.
* **Danger / Error**: Coral Rose (`#EF4444`) — Failed enrollments, overdue fines, system alerts.
* **Information**: Sky Cyan (`#06B6D4`) — Campus announcements, schedule updates.

---

## 3. Typography & Hierarchy

* **Primary Font**: `Plus Jakarta Sans` / `Inter` (Google Fonts)
* **Monospace Font**: `JetBrains Mono` (for Roll Numbers, Barcodes, Financial Amounts, Verification Hashes)

| Element | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| **Display H1** | `2.25rem (36px)` | 700 (Bold) | `1.2` | Portal Hero, Metric Banner |
| **Section H2** | `1.5rem (24px)` | 600 (SemiBold)| `1.3` | Section Headers (Transcript, Fee Breakdown) |
| **Card Title H3** | `1.125rem (18px)` | 600 (SemiBold)| `1.4` | Component & Stat Card Titles |
| **Body Regular** | `0.875rem (14px)` | 400 (Regular) | `1.5` | Standard content, table cells, descriptions |
| **Caption / Meta** | `0.75rem (12px)` | 500 (Medium) | `1.4` | Timestamps, tags, badges, secondary notes |

---

## 4. UI Patterns & Interactive Components

### 4.1 Student Portal Dashboard
* **Hero Banner**: Displays Student Name, Roll Number, Degree Program, Active Semester, and dynamic CGPA meter.
* **Quick Stats Grid**: 4 top cards displaying (1) CGPA with trend delta, (2) Credits Completed / Remaining, (3) Current Term Attendance %, (4) Outstanding Fee Balance.
* **Interactive Semester Transcript**: Horizontal pill selector for semesters 1 through 8+; clicking a semester smoothly displays course grades, GPAs, and credits.

### 4.2 Timetable Weekly Matrix
* Dynamic 7-day grid with color-coded lecture blocks displaying course code, instructor avatar, classroom number, and start/end time.

### 4.3 Micro-Animations & Feedback
* **Hover Micro-Lifts**: Cards smoothly elevate (`translateY(-2px)`) with enhanced box-shadows.
* **Optimistic Toggles**: Instant state updates with background rollback on network errors.
* **Skeleton Shimmers**: High-fidelity skeleton loaders replacing spinners during initial queries.
