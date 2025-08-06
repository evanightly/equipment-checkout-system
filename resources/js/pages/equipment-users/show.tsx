import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { EquipmentUser } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, Package, RotateCcw, User, XCircle } from 'lucide-react';

interface Props {
    borrowing: EquipmentUser;
    canManage: boolean;
}

export default function ShowBorrowing({ borrowing, canManage }: Props) {
    const isOverdue = borrowing.status === 'approved' && new Date(borrowing.due_date) < new Date() && !borrowing.returned_at;

    const getStatusVariant = (status: string) => {
        if (isOverdue) return 'overdue';
        switch (status) {
            case 'pending':
                return 'pending';
            case 'approved':
                return 'approved';
            case 'cancelled':
                return 'rejected';
            case 'returned':
                return 'returned';
            default:
                return 'outline';
        }
    };

    const getStatusLabel = (status: string) => {
        if (isOverdue) return 'Overdue';
        switch (status) {
            case 'pending':
                return 'Pending Approval';
            case 'approved':
                return 'Approved';
            case 'cancelled':
                return 'Cancelled';
            case 'returned':
                return 'Returned';
            default:
                return status;
        }
    };

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this borrowing request?')) {
            router.patch(route('equipment-users.approve', borrowing.id));
        }
    };

    const handleReject = () => {
        if (confirm('Are you sure you want to reject this borrowing request?')) {
            router.patch(route('equipment-users.reject', borrowing.id));
        }
    };

    const handleReturn = () => {
        if (confirm('Mark this equipment as returned?')) {
            router.patch(route('equipment-users.return', borrowing.id));
        }
    };

    return (
        <AppLayout>
            <Head title={`Borrowing Request - ${borrowing.equipment?.name}`} />

            <div className='flex flex-col space-y-6 p-4'>
                {/* Header */}
                <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                    <div className='flex items-center space-x-4'>
                        <Button asChild size='sm' variant='outline'>
                            <Link href={route('equipment-users.index')}>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                Back to Equipment Users
                            </Link>
                        </Button>
                        <div>
                            <div className='flex items-center space-x-3'>
                                <h1 className='text-2xl font-bold tracking-tight'>Borrowing Request</h1>
                                <Badge variant={getStatusVariant(borrowing.status)}>{getStatusLabel(borrowing.status)}</Badge>
                                {isOverdue && (
                                    <Badge variant='destructive'>
                                        <Clock className='mr-1 h-3 w-3' />
                                        Overdue
                                    </Badge>
                                )}
                            </div>
                            <p className='text-muted-foreground'>
                                Request #{borrowing.id} - {borrowing.equipment?.name}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {canManage && (
                        <div className='flex items-center space-x-2'>
                            {borrowing.status === 'pending' && (
                                <>
                                    <Button onClick={handleApprove} size='sm'>
                                        <CheckCircle className='mr-2 h-4 w-4' />
                                        Approve
                                    </Button>
                                    <Button onClick={handleReject} size='sm' variant='destructive'>
                                        <XCircle className='mr-2 h-4 w-4' />
                                        Reject
                                    </Button>
                                </>
                            )}
                            {borrowing.status === 'approved' && !borrowing.returned_at && (
                                <Button onClick={handleReturn} size='sm' variant='outline'>
                                    <RotateCcw className='mr-2 h-4 w-4' />
                                    Mark as Returned
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* New Segmented Layout */}
                <div className='grid h-[calc(100vh-200px)] grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Left Column - Equipment Details */}
                    <div className='flex h-full flex-col'>
                        <Card className='flex flex-1 flex-col'>
                            <CardHeader className='flex-shrink-0'>
                                <CardTitle className='flex items-center'>
                                    <Package className='mr-2 h-5 w-5' />
                                    Equipment{' '}
                                    {(() => {
                                        const equipmentItems = borrowing.equipment_user_details?.length
                                            ? borrowing.equipment_user_details.map((detail) => detail.equipment).filter(Boolean)
                                            : borrowing.equipment
                                              ? [borrowing.equipment]
                                              : [];
                                        return equipmentItems.length > 1 ? `(${equipmentItems.length} items)` : '';
                                    })()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='flex-1 overflow-y-auto'>
                                {(() => {
                                    // Get all equipment items (from details if available, fallback to main equipment)
                                    const equipmentItems = borrowing.equipment_user_details?.length
                                        ? borrowing.equipment_user_details.map((detail) => detail.equipment).filter(Boolean)
                                        : borrowing.equipment
                                          ? [borrowing.equipment]
                                          : [];

                                    if (equipmentItems.length === 0) {
                                        return <div className='text-muted-foreground'>No equipment assigned</div>;
                                    }

                                    if (equipmentItems.length === 1) {
                                        // Single equipment - show full details
                                        const equipment = equipmentItems[0];
                                        return (
                                            <div className='space-y-4'>
                                                {/* Equipment Image */}
                                                <div className='aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'>
                                                    {equipment?.image_path ? (
                                                        <img
                                                            alt={equipment.name}
                                                            className='h-full w-full object-cover'
                                                            src={`/storage/${equipment.image_path}`}
                                                        />
                                                    ) : (
                                                        <div className='flex h-full items-center justify-center'>
                                                            <Package className='h-16 w-16 text-gray-400' />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Equipment Info */}
                                                <div className='space-y-2'>
                                                    <h3 className='font-semibold'>{equipment?.name}</h3>
                                                    <div className='space-y-1 text-sm text-muted-foreground'>
                                                        <p>
                                                            <span className='font-medium'>Brand:</span> {equipment?.brand}
                                                        </p>
                                                        <p>
                                                            <span className='font-medium'>Model:</span> {equipment?.model}
                                                        </p>
                                                        <p>
                                                            <span className='font-medium'>Type:</span> {equipment?.type}
                                                        </p>
                                                        {equipment?.serial_number && (
                                                            <p>
                                                                <span className='font-medium'>Serial:</span> {equipment.serial_number}
                                                            </p>
                                                        )}
                                                        {equipment?.division && (
                                                            <p>
                                                                <span className='font-medium'>Division:</span> {equipment.division.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {equipment && (
                                                    <Button asChild className='w-full' size='sm' variant='outline'>
                                                        <Link href={route('equipment.show', equipment.id)}>View Equipment Details</Link>
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    }

                                    // Multiple equipment - show grid
                                    return (
                                        <div className='space-y-4'>
                                            <div className='grid grid-cols-2 gap-3'>
                                                {equipmentItems.slice(0, 4).map((equipment, index) => (
                                                    <Dialog key={equipment?.id || index}>
                                                        <DialogTrigger asChild>
                                                            <div className='group cursor-pointer rounded-lg border p-3 transition-all hover:border-primary hover:shadow-md'>
                                                                <div className='mb-2 aspect-square w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-800'>
                                                                    {equipment?.image_path ? (
                                                                        <img
                                                                            alt={equipment.name}
                                                                            className='h-full w-full object-cover transition-transform group-hover:scale-105'
                                                                            src={`/storage/${equipment.image_path}`}
                                                                        />
                                                                    ) : (
                                                                        <div className='flex h-full items-center justify-center'>
                                                                            <Package className='h-8 w-8 text-gray-400' />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className='text-xs'>
                                                                    <p className='truncate font-medium'>{equipment?.name}</p>
                                                                    <p className='truncate text-muted-foreground'>
                                                                        {equipment?.brand} {equipment?.model}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </DialogTrigger>
                                                        <DialogContent className='max-w-md'>
                                                            <DialogHeader>
                                                                <DialogTitle>{equipment?.name}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className='space-y-4'>
                                                                <div className='aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'>
                                                                    {equipment?.image_path ? (
                                                                        <img
                                                                            alt={equipment?.name}
                                                                            className='h-full w-full object-cover'
                                                                            src={`/storage/${equipment?.image_path}`}
                                                                        />
                                                                    ) : (
                                                                        <div className='flex h-full items-center justify-center'>
                                                                            <Package className='h-16 w-16 text-gray-400' />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className='space-y-2 text-sm'>
                                                                    <p>
                                                                        <span className='font-medium'>Brand:</span> {equipment?.brand}
                                                                    </p>
                                                                    <p>
                                                                        <span className='font-medium'>Model:</span> {equipment?.model}
                                                                    </p>
                                                                    <p>
                                                                        <span className='font-medium'>Type:</span> {equipment?.type}
                                                                    </p>
                                                                    {equipment?.serial_number && (
                                                                        <p>
                                                                            <span className='font-medium'>Serial:</span> {equipment?.serial_number}
                                                                        </p>
                                                                    )}
                                                                    {equipment?.division && (
                                                                        <p>
                                                                            <span className='font-medium'>Division:</span> {equipment?.division.name}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {equipment && (
                                                                    <Button asChild className='w-full' size='sm' variant='outline'>
                                                                        <Link href={route('equipment.show', equipment.id)}>
                                                                            View Equipment Details
                                                                        </Link>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                ))}
                                            </div>
                                            {equipmentItems.length > 4 && (
                                                <p className='text-center text-sm text-muted-foreground'>
                                                    +{equipmentItems.length - 4} more equipment items
                                                </p>
                                            )}
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Request Details */}
                    <div className='flex h-full flex-col overflow-hidden'>
                        <div className='h-full space-y-6 overflow-y-auto pr-2'>
                            {/* Borrower Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center'>
                                        <User className='mr-2 h-5 w-5' />
                                        Borrower Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {borrowing.user && (
                                        <div className='grid gap-4 sm:grid-cols-2'>
                                            <div>
                                                <label className='text-sm font-medium text-muted-foreground'>Name</label>
                                                <p className='text-sm'>{borrowing.user.name}</p>
                                            </div>
                                            <div>
                                                <label className='text-sm font-medium text-muted-foreground'>Email</label>
                                                <p className='text-sm'>{borrowing.user.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Equipment Table for Multiple Items */}
                            {borrowing.equipment_user_details && borrowing.equipment_user_details.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='flex items-center'>
                                            <Package className='mr-2 h-5 w-5' />
                                            Borrowed Equipment ({borrowing.equipment_user_details.length} items)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Equipment</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {borrowing.equipment_user_details.map((detail, index) => (
                                                    <TableRow key={detail.id || index}>
                                                        <TableCell>
                                                            <div className='flex items-center space-x-3'>
                                                                <div className='h-8 w-8 overflow-hidden rounded bg-gray-100 dark:bg-gray-800'>
                                                                    {detail.equipment?.image_path ? (
                                                                        <img
                                                                            alt={detail.equipment.name}
                                                                            className='h-full w-full object-cover'
                                                                            src={`/storage/${detail.equipment.image_path}`}
                                                                        />
                                                                    ) : (
                                                                        <Package className='h-full w-full p-1 text-gray-400' />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className='font-medium'>{detail.equipment?.name}</p>
                                                                    <p className='text-sm text-muted-foreground'>
                                                                        {detail.equipment?.brand} {detail.equipment?.model}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{detail.equipment?.type}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    borrowing.status === 'pending'
                                                                        ? 'pending'
                                                                        : borrowing.status === 'approved' &&
                                                                            borrowing.due_date &&
                                                                            new Date() > new Date(borrowing.due_date)
                                                                          ? 'overdue'
                                                                          : borrowing.status === 'approved'
                                                                            ? 'approved'
                                                                            : borrowing.status === 'returned'
                                                                              ? 'returned'
                                                                              : borrowing.status === 'cancelled'
                                                                                ? 'rejected'
                                                                                : 'default'
                                                                }
                                                            >
                                                                {borrowing.status === 'approved' &&
                                                                borrowing.due_date &&
                                                                new Date() > new Date(borrowing.due_date)
                                                                    ? 'overdue'
                                                                    : borrowing.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Request Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center'>
                                        <Calendar className='mr-2 h-5 w-5' />
                                        Request Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <div>
                                            <label className='text-sm font-medium text-muted-foreground'>Request Date</label>
                                            <p className='text-sm'>{format(new Date(borrowing.created_at), 'MMM dd, yyyy HH:mm')}</p>
                                        </div>
                                        <div>
                                            <label className='text-sm font-medium text-muted-foreground'>Borrowed Date</label>
                                            <p className='text-sm'>{format(new Date(borrowing.borrowed_at), 'MMM dd, yyyy')}</p>
                                        </div>
                                        <div>
                                            <label className='text-sm font-medium text-muted-foreground'>Due Date</label>
                                            <p className={`text-sm ${isOverdue ? 'font-medium text-red-600' : ''}`}>
                                                {format(new Date(borrowing.due_date), 'MMM dd, yyyy')}
                                                {isOverdue && <span className='ml-1'>(Overdue)</span>}
                                            </p>
                                        </div>
                                        {borrowing.returned_at && (
                                            <div>
                                                <label className='text-sm font-medium text-muted-foreground'>Returned Date</label>
                                                <p className='text-sm'>{format(new Date(borrowing.returned_at), 'MMM dd, yyyy HH:mm')}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className='border-t pt-4'>
                                        <label className='text-sm font-medium text-muted-foreground'>Purpose</label>
                                        <p className='mt-1 text-sm'>{borrowing.purpose || 'Not specified'}</p>
                                    </div>

                                    {borrowing.notes && (
                                        <div className='border-t pt-4'>
                                            <label className='text-sm font-medium text-muted-foreground'>Additional Notes</label>
                                            <p className='mt-1 text-sm whitespace-pre-wrap'>{borrowing.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Approval Information */}
                            {(borrowing.status === 'approved' || borrowing.status === 'cancelled') && borrowing.approver && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='flex items-center'>
                                            <FileText className='mr-2 h-5 w-5' />
                                            Approval Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='grid gap-4 sm:grid-cols-2'>
                                            <div>
                                                <label className='text-sm font-medium text-muted-foreground'>
                                                    {borrowing.status === 'approved' ? 'Approved by' : 'Cancelled by'}
                                                </label>
                                                <p className='text-sm'>{borrowing.approver.name}</p>
                                            </div>
                                            <div>
                                                <label className='text-sm font-medium text-muted-foreground'>
                                                    {borrowing.status === 'approved' ? 'Approval Date' : 'Rejection Date'}
                                                </label>
                                                <p className='text-sm'>
                                                    {borrowing.approved_at && format(new Date(borrowing.approved_at), 'MMM dd, yyyy HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
