## Rules:

- execute each task carefully, provide clear and concise code, and ensure that the code adheres to best practices for maintainability and readability.
- Use TypeScript for type safety in the React frontend.
- Ensure that the backend API endpoints are well-documented and follow RESTful conventions.

## Project Overview: Broadcast Equipment Management System (Non-technical, PM Perspective)

- Broadcast Equipment Dashboard
    - Displays a list of broadcast equipment (mic, mixer, recorder, tripod, etc.)
    - Statuses: Tersedia, Dipinjam, Perlu Servis, Rusak

- Equipment Check-In/Check-Out Form
    - Borrowers log in or provide details (name, division, date, purpose)
    - Borrowing history is automatically recorded

- Reports & Automated Notifications
    - Monthly recap of frequently borrowed equipment
    - Notifications via internal email or WhatsApp if equipment is overdue

- Multi-Level User Access
    - Admin (Technician)
    - Viewer (Editorial/Production)
    - Superadmin (Management)

## Stack:

- Laravel backend with `spatie/laravel-query-builder`,
- Inertia React frontend using `react-query` for data fetching and shadcn for ui components.
- CQRS pattern is preferred—separate commands (mutations) and queries (data reads) into distinct concerns.

## Backend models:

- Equipment: Represents broadcast equipment with fields for name, type, status, and history.
- User: Represents users with roles (admin, viewer, superadmin) and their borrowing history.
- Division: Represents different divisions within the organization, linked to users.
- EquipmentUser: Represents the relationship between equipment and users, including borrowing details.
