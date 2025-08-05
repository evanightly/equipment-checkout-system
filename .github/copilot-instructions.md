## Rules:

- execute each task carefully, provide clear and concise code, and ensure that the code adheres to best practices for maintainability and readability.
- Use TypeScript for type safety in the React frontend.
- Ensure that the backend API endpoints are well-documented and follow RESTful conventions.
- No need to rebuild and server the app, i've alread use composer dev

## Project Overview: Broadcast Equipment Management System (Non-technical, PM Perspective)

- Broadcast Equipment Dashboard
    - Model Name: `Equipment`
    - Displays a list of broadcast equipment (mic, mixer, recorder, tripod, etc.)
    - Statuses: Tersedia, Dipinjam, Perlu Servis, Rusak

- Equipment Check-In/Check-Out Form
    - Model Name: `EquipmentUser`
    - Borrowers log in or provide details (name, division, date, purpose)
    - Borrowing history is automatically recorded

- Reports & Automated Notifications (Not implemented yet)
    - Monthly recap of frequently borrowed equipment
    - Notifications via internal email or WhatsApp if equipment is overdue

- Multi-Level User Access (Using Spatie Laravel Permissions)
    - Admin (Technician)
    - Viewer (Editorial/Production)
    - Superadmin (Management)

## Stack:

- Laravel backend
    - Inertia.js for seamless SPA experience.
    - Uses Spatie Laravel Permissions for role-based access control.
- Inertia React frontend using shadcn and magicui for ui components.
- MariaDB for the database.
- Tailwind CSS V5 for styling.
- TypeScript for type safety in the frontend.

## Backend models:

- Equipment: Represents broadcast equipment with fields for name, type, status, and history.
- User: Represents users with roles (admin, viewer, superadmin) and their borrowing history.
- Division: Represents different divisions within the organization, linked to users.
- EquipmentUser: Represents the relationship between equipment and users, including borrowing details.
