import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { columns } from './columns';

interface UserIndexProps {
    users: PaginateResponse<{
        id: string;
        name: string;
        email: string;
        created_at: string;
        updated_at: string;
    }>;
}

export default function UserIndex({ users }: UserIndexProps) {
    return (
        <AppLayout>
            <div className='p-4'>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold'>Users</h1>
                    <p className='text-muted-foreground'>Manage system users and their information.</p>
                </div>

                <DataTable columns={columns} response={users} />
            </div>
        </AppLayout>
    );
}
