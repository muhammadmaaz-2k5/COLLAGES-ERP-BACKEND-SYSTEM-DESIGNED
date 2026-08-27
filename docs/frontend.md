# Frontend Architecture Specification

This document details the frontend engineering standards, technology stack, directory structure, component design system, state management, and routing architecture for the University / College ERP.

---

## 1. Technology Stack

* **Framework**: React 18+ / Next.js (App Router) or Vite React SPA
* **Language**: TypeScript 5.x (Strict Mode enabled)
* **Styling**: Vanilla CSS / CSS Modules with Design Tokens (Custom Theme Engine)
* **State Management**:
  * **Server State**: `@tanstack/react-query` (Caching, Background Fetching, Optimistic Updates)
  * **Client / UI State**: `Zustand` (Global auth session, sidebar toggle, modal states)
* **Form Handling & Validation**: `react-hook-form` + `zod`
* **Data Visualization & Charts**: `Recharts` / `Chart.js` (CGPA trends, attendance gauges, fee distributions)
* **Icons**: `Lucide React` (Consistent lightweight vector icons)

---

## 2. Directory Structure

```
frontend/
├── public/                     # Static assets, logos, fonts
├── src/
│   ├── assets/                 # SVGs, illustrations, brand graphics
│   ├── components/             # Reusable UI primitives
│   │   ├── ui/                 # Buttons, inputs, modals, badges, cards, tables
│   │   ├── layout/             # Topbar, sidebar navigation, breadcrumbs, shell
│   │   ├── feedback/           # Toasts, skeletons, error boundaries, empty states
│   │   └── data-display/       # DataTables, stat cards, metric meters
│   ├── features/               # Domain-driven feature modules
│   │   ├── student-portal/     # Module 1: Dashboard, Transcript, LMS, Fees, Timetable
│   │   ├── teacher-portal/     # Grade submissions, attendance marking, quiz builder
│   │   ├── admin-portal/       # Course catalog, faculty onboarding, announcements
│   │   ├── finance-portal/     # Challans, payment verification, accounts ledger
│   │   ├── exam-portal/        # Datesheets, hall tickets, result approval
│   │   └── admissions-portal/  # Application screening, merit calculation
│   ├── hooks/                  # Custom React hooks (useAuth, usePermissions, useDebounce)
│   ├── lib/                    # API clients (Axios instance), query client, utils
│   ├── routes/                 # Protected route guards & route definitions
│   ├── styles/                 # Global design tokens, typography, dark/light themes
│   ├── types/                  # TypeScript interfaces & API schema types
│   └── App.tsx                 # Root application component
└── package.json
```

---

## 3. Component Architecture & Design System

### 3.1 Design System Tokens (`src/styles/tokens.css`)
* **Color Palettes**: Primary Slate, Academic Navy, Accent Indigo, Success Emerald, Warning Amber, Danger Rose.
* **Typography**: Clean modern fonts (`Inter`, `Outfit`, `Plus Jakarta Sans`).
* **Glassmorphism & Depth**: Multi-tier elevation shadows, subtle border radii (`8px`, `12px`, `16px`), and smooth backdrop blurs.

### 3.2 Key UI Primitives
* **`DataTable`**: Virtualized, sortable, searchable, and paginated table with column visibility toggles.
* **`StatCard`**: Overview metric cards with trend indicators, icon badges, and micro-animations.
* **`StatusBadge`**: Pill badges dynamically mapped to enum states (e.g. `PAID` $\rightarrow$ green, `OVERDUE` $\rightarrow$ red).
* **`Modal` & `Drawer`**: Accessible dialogs with smooth entrance animations and focus trapping.

---

## 4. Protected Routing & Role Guards

```tsx
// src/routes/RoleGuard.tsx
export const RoleGuard = ({ allowedRoles, children }: { allowedRoles: SystemRole[], children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/403-unauthorized" replace />;

  return <>{children}</>;
};
```

---

## 5. Performance & Accessibility (a11y)

* **Code Splitting**: Route-level lazy loading (`React.lazy()` / dynamic imports) ensuring initial bundle size $< 150\text{ KB}$.
* **WCAG 2.1 AA Compliance**: High-contrast color ratios, semantic HTML5 landmarks, and full keyboard navigation.
* **Responsive Breakpoints**: Seamless layouts from mobile ($375\text{px}$) to widescreen desktop ($1920\text{px}$).
