import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    division_id?: number;
    division?: Division;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Division {
    id: number;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    users_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Equipment {
    id: number;
    name: string;
    brand: string;
    model: string;
    serial_number?: string;
    type: string;
    description?: string;
    purchase_date?: string;
    purchase_price?: number;
    warranty_expires_at?: string;
    status: 'available' | 'borrowed' | 'maintenance' | 'damaged' | 'retired';
    division_id: number;
    division?: Division;
    image_path?: string;
    notes?: string;
    is_available_for_borrowing: boolean;
    current_borrower?: User;
    borrowing_history?: EquipmentUser[];
    created_at: string;
    updated_at: string;
}

export interface EquipmentUserDetail {
    id: number;
    equipment_user_id: number;
    equipment_id: number;
    equipment?: Equipment;
    created_at: string;
    updated_at: string;
}

export interface EquipmentUser {
    id: number;
    equipment_id: number;
    user_id: number;
    borrowed_at: string;
    due_date: string;
    returned_at?: string;
    status: 'pending' | 'approved' | 'borrowed' | 'returned' | 'overdue' | 'cancelled';
    purpose?: string;
    notes?: string;
    approved_by?: number;
    approved_at?: string;
    equipment?: Equipment;
    user?: User;
    approver?: User;
    equipment_user_details?: EquipmentUserDetail[];
    created_at: string;
    updated_at: string;
}
