import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Equipment } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, CreditCard, Edit, FileText, History, Package, Settings, User } from 'lucide-react';

interface Props {
    equipment: Equipment;
}

export default function ShowEquipment({ equipment }: Props) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'available':
                return 'default';
            case 'borrowed':
                return 'secondary';
            case 'maintenance':
                return 'outline';
            case 'damaged':
                return 'destructive';
            case 'retired':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'available':
                return 'Available';
            case 'borrowed':
                return 'Borrowed';
            case 'maintenance':
                return 'Under Maintenance';
            case 'damaged':
                return 'Damaged';
            case 'retired':
                return 'Retired';
            default:
                return status;
        }
    };

    return (
        <AppLayout>
            <Head title={equipment.name} />

            <div className='flex flex-col space-y-6 p-4'>
                {/* Header */}
                <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                    <div className='flex items-center space-x-4'>
                        <Button asChild size='sm' variant='outline'>
                            <Link href={route('equipment.index')}>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                Back to Equipment
                            </Link>
                        </Button>
                        <div>
                            <div className='flex items-center space-x-3'>
                                <h1 className='text-2xl font-bold tracking-tight'>{equipment.name}</h1>
                                <Badge variant={getStatusVariant(equipment.status)}>{getStatusLabel(equipment.status)}</Badge>
                            </div>
                            <p className='text-muted-foreground'>
                                {equipment.brand} {equipment.model} - {equipment.type}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button asChild size='sm'>
                            <Link href={route('equipment.edit', equipment.id)}>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit Equipment
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className='grid gap-6 lg:grid-cols-3'>
                    {/* Equipment Image */}
                    <div className='lg:col-span-1'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center'>
                                    <Package className='mr-2 h-5 w-5' />
                                    Equipment Photo
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'>
                                    {equipment.image_path ? (
                                        <img alt={equipment.name} className='h-full w-full object-cover' src={`/storage/${equipment.image_path}`} />
                                    ) : (
                                        <div className='flex h-full items-center justify-center'>
                                            <div className='text-center'>
                                                <Package className='mx-auto h-16 w-16 text-gray-400' />
                                                <p className='mt-4 text-sm text-gray-500'>No image available</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Equipment Details */}
                    <div className='space-y-6 lg:col-span-2'>
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center'>
                                    <Settings className='mr-2 h-5 w-5' />
                                    Equipment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='grid gap-4 sm:grid-cols-2'>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Name</label>
                                        <p className='text-sm'>{equipment.name}</p>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Type</label>
                                        <p className='text-sm'>{equipment.type}</p>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Brand</label>
                                        <p className='text-sm'>{equipment.brand}</p>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Model</label>
                                        <p className='text-sm'>{equipment.model}</p>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Serial Number</label>
                                        <p className='font-mono text-sm'>{equipment.serial_number || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Division</label>
                                        <p className='text-sm'>{equipment.division?.name || 'Not assigned'}</p>
                                    </div>
                                </div>

                                {equipment.description && (
                                    <div className='border-t pt-4'>
                                        <label className='text-sm font-medium text-muted-foreground'>Description</label>
                                        <p className='mt-1 text-sm'>{equipment.description}</p>
                                    </div>
                                )}

                                <div className='flex items-center space-x-4 border-t pt-4'>
                                    <div className='flex items-center space-x-2'>
                                        <span className='text-sm font-medium text-muted-foreground'>Available for borrowing:</span>
                                        <Badge variant={equipment.is_available_for_borrowing ? 'default' : 'secondary'}>
                                            {equipment.is_available_for_borrowing ? 'Yes' : 'No'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Purchase Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center'>
                                    <CreditCard className='mr-2 h-5 w-5' />
                                    Purchase Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='grid gap-4 sm:grid-cols-3'>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Purchase Date</label>
                                        <p className='text-sm'>
                                            {equipment.purchase_date ? format(new Date(equipment.purchase_date), 'MMM dd, yyyy') : 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Purchase Price</label>
                                        <p className='text-sm'>
                                            {equipment.purchase_price ? `$${Number(equipment.purchase_price).toLocaleString()}` : 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-muted-foreground'>Warranty Expires</label>
                                        <p className='text-sm'>
                                            {equipment.warranty_expires_at
                                                ? format(new Date(equipment.warranty_expires_at), 'MMM dd, yyyy')
                                                : 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current Borrower */}
                        {equipment.current_borrower && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center'>
                                        <User className='mr-2 h-5 w-5' />
                                        Current Borrower
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex items-center space-x-4'>
                                        <div>
                                            <p className='font-medium'>{equipment.current_borrower.name}</p>
                                            <p className='text-sm text-muted-foreground'>{equipment.current_borrower.email}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notes */}
                        {equipment.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center'>
                                        <FileText className='mr-2 h-5 w-5' />
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-sm whitespace-pre-wrap'>{equipment.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Borrowing History */}
                {equipment.borrowing_history && equipment.borrowing_history.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center'>
                                <History className='mr-2 h-5 w-5' />
                                Borrowing History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Borrower</TableHead>
                                        <TableHead>Borrowed Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Returned Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {equipment.borrowing_history.map((borrowing) => (
                                        <TableRow key={borrowing.id}>
                                            <TableCell>
                                                <div>
                                                    <p className='font-medium'>{borrowing.user?.name}</p>
                                                    <p className='text-sm text-muted-foreground'>{borrowing.user?.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{format(new Date(borrowing.borrowed_at), 'MMM dd, yyyy')}</TableCell>
                                            <TableCell>{format(new Date(borrowing.due_date), 'MMM dd, yyyy')}</TableCell>
                                            <TableCell>
                                                {borrowing.returned_at ? format(new Date(borrowing.returned_at), 'MMM dd, yyyy') : 'Not returned'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        borrowing.status === 'approved'
                                                            ? 'default'
                                                            : borrowing.status === 'returned'
                                                              ? 'secondary'
                                                              : borrowing.status === 'cancelled'
                                                                ? 'destructive'
                                                                : 'outline'
                                                    }
                                                >
                                                    {borrowing.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
