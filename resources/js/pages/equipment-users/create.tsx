import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Equipment } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, FileText, Package } from 'lucide-react';
import { FormEvent } from 'react';

interface Props {
    availableEquipment: Equipment[];
}

export default function CreateEquipmentUser({ availableEquipment }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        equipment_ids: [] as string[],
        due_date: '',
        purpose: '',
        notes: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('equipment-users.store'));
    };

    const handleEquipmentToggle = (equipmentId: string) => {
        setData(
            'equipment_ids',
            data.equipment_ids.includes(equipmentId) ? data.equipment_ids.filter((id) => id !== equipmentId) : [...data.equipment_ids, equipmentId],
        );
    };

    // Calculate minimum date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <AppLayout>
            <Head title='Request Equipment Borrowing' />

            <div className='flex flex-col space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center space-x-4'>
                    <Button asChild size='sm' variant='outline'>
                        <Link href={route('equipment-users.index')}>
                            <ArrowLeft className='mr-2 h-4 w-4' />
                            Back to Equipment Users
                        </Link>
                    </Button>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight'>Request Equipment Borrowing</h1>
                        <p className='text-muted-foreground'>Submit a request to borrow equipment</p>
                    </div>
                </div>

                <div className='grid gap-6 lg:grid-cols-3'>
                    {/* Form */}
                    <div className='lg:col-span-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center'>
                                    <FileText className='mr-2 h-5 w-5' />
                                    Borrowing Request Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className='space-y-6' onSubmit={handleSubmit}>
                                    {/* Equipment Selection */}
                                    <div className='space-y-2'>
                                        <Label htmlFor='equipment_ids'>Equipment * (Select multiple)</Label>
                                        <div className='max-h-64 space-y-2 overflow-y-auto rounded-md border p-2'>
                                            {availableEquipment.map((equipment) => (
                                                <label
                                                    className='flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-muted'
                                                    key={equipment.id}
                                                >
                                                    <input
                                                        checked={data.equipment_ids.includes(equipment.id.toString())}
                                                        className='rounded'
                                                        onChange={() => handleEquipmentToggle(equipment.id.toString())}
                                                        type='checkbox'
                                                    />
                                                    <Package className='h-4 w-4' />
                                                    <span className='flex-1'>
                                                        {equipment.name} - {equipment.brand} {equipment.model}
                                                        {equipment.division && (
                                                            <span className='ml-2 text-sm text-muted-foreground'>({equipment.division.name})</span>
                                                        )}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {data.equipment_ids.length > 0 && (
                                            <p className='text-sm text-muted-foreground'>{data.equipment_ids.length} equipment(s) selected</p>
                                        )}
                                        {errors.equipment_ids && <p className='text-sm text-destructive'>{errors.equipment_ids}</p>}
                                        {availableEquipment.length === 0 && (
                                            <p className='text-sm text-muted-foreground'>No equipment is currently available for borrowing.</p>
                                        )}
                                    </div>

                                    {/* Purpose */}
                                    <div className='space-y-2'>
                                        <Label htmlFor='purpose'>Purpose of Borrowing *</Label>
                                        <Input
                                            id='purpose'
                                            onChange={(e) => setData('purpose', e.target.value)}
                                            placeholder='e.g., Video production for news segment'
                                            value={data.purpose}
                                        />
                                        {errors.purpose && <p className='text-sm text-destructive'>{errors.purpose}</p>}
                                    </div>

                                    {/* Due Date */}
                                    <div className='space-y-2'>
                                        <Label htmlFor='due_date'>Return Due Date *</Label>
                                        <Input
                                            id='due_date'
                                            min={minDate}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            type='date'
                                            value={data.due_date}
                                        />
                                        {errors.due_date && <p className='text-sm text-destructive'>{errors.due_date}</p>}
                                        <p className='text-xs text-muted-foreground'>Select when you plan to return the equipment</p>
                                    </div>

                                    {/* Additional Notes */}
                                    <div className='space-y-2'>
                                        <Label htmlFor='notes'>Additional Notes</Label>
                                        <Textarea
                                            id='notes'
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder='Any additional information or special requirements...'
                                            rows={4}
                                            value={data.notes}
                                        />
                                        {errors.notes && <p className='text-sm text-destructive'>{errors.notes}</p>}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className='flex items-center space-x-4 pt-4'>
                                        <Button disabled={processing || data.equipment_ids.length === 0} type='submit'>
                                            {processing ? 'Submitting Request...' : 'Submit Borrowing Request'}
                                        </Button>
                                        <Button asChild type='button' variant='outline'>
                                            <Link href={route('equipment-users.index')}>Cancel</Link>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Equipment Preview */}
                    <div className='lg:col-span-1'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center'>
                                    <Package className='mr-2 h-5 w-5' />
                                    Selected Equipment ({data.equipment_ids.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data.equipment_ids.length > 0 ? (
                                    <div className='space-y-4'>
                                        {data.equipment_ids.map((equipmentId) => {
                                            const equipment = availableEquipment.find((eq) => eq.id.toString() === equipmentId);
                                            if (!equipment) return null;

                                            return (
                                                <div className='space-y-2 rounded-lg border p-3' key={equipment.id}>
                                                    <div className='flex items-center justify-between'>
                                                        <h4 className='font-medium'>{equipment.name}</h4>
                                                        <button
                                                            className='text-sm text-destructive hover:text-destructive/80'
                                                            onClick={() => handleEquipmentToggle(equipment.id.toString())}
                                                            type='button'
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <div className='space-y-1 text-sm text-muted-foreground'>
                                                        <p>
                                                            <span className='font-medium'>Brand:</span> {equipment.brand}
                                                        </p>
                                                        <p>
                                                            <span className='font-medium'>Model:</span> {equipment.model}
                                                        </p>
                                                        <p>
                                                            <span className='font-medium'>Type:</span> {equipment.type}
                                                        </p>
                                                        {equipment.division && (
                                                            <p>
                                                                <span className='font-medium'>Division:</span> {equipment.division.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className='text-center text-muted-foreground'>
                                        <Package className='mx-auto mb-4 h-16 w-16 opacity-50' />
                                        <p className='text-sm'>Select equipment to see details</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Borrowing Guidelines */}
                        <Card className='mt-6'>
                            <CardHeader>
                                <CardTitle className='flex items-center'>
                                    <Calendar className='mr-2 h-5 w-5' />
                                    Borrowing Guidelines
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-3 text-sm text-muted-foreground'>
                                <div className='space-y-2'>
                                    <p>• Requests require approval from equipment administrators</p>
                                    <p>• Return equipment by the due date to avoid penalties</p>
                                    <p>• Report any damage or issues immediately</p>
                                    <p>• Equipment must be returned in the same condition</p>
                                    <p>• Late returns may affect future borrowing privileges</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
