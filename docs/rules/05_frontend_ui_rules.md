# Module Rules: Frontend UI & Design System

## 1. Visual Standards & Aesthetics
* Follow the design system tokens defined in [docs/ui-ux.md](file:///c:/Users/RYZEN%207/Downloads/CollageManagement/docs/ui-ux.md).
* Every interactive component must provide hover states, active states, focus rings, and disabled states.
* Never show raw untranslated error messages; display user-friendly toast or alert banners with actionable guidance.

## 2. Data Fetching & Caching Standards
* All server queries must use `@tanstack/react-query` with standard cache keys:
  * Example: `['students', 'profile', studentId]`, `['lms', 'enrollments', 'my']`.
* Mutations must invalidate affected query keys upon success:
  * Example: Registering for a course invalidates `['lms', 'enrollments', 'my']` and `['offerings', 'timetable']`.

## 3. Responsive Layout & Accessibility
* All tables must gracefully degrade into card view or support smooth horizontal scroll on mobile devices ($< 768\text{px}$).
* Maintain proper contrast ratios ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text).
* Every form field must be linked to a `<label>` with proper `aria-describedby` for validation errors.
