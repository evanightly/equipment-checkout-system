import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Division } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Package, Upload } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Props {
    divisions: Division[];
    statuses: Array<{
        name: string;
        value: string;
    }>;
}

export default function CreateEquipment({ divisions, statuses }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        brand: '',
        model: '',
        serial_number: '',
        type: '',
        description: '',
        purchase_date: '',
        purchase_price: '',
        warranty_expires_at: '',
        status: 'available',
        division_id: '',
        image: null as File | null,
        notes: '',
        is_available_for_borrowing: true as boolean,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Log form data for debugging
        console.log('Form data being submitted:', data);
        console.log('Current errors:', errors);

        post(route('equipment.store'), {
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
            onSuccess: () => {
                console.log('Equipment created successfully');
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        // Reset file input
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <AppLayout>
            <Head title='Add Equipment' />

            <div className='flex flex-col space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center space-x-4'>
                    <Button asChild size='sm' variant='outline'>
                        <Link href={route('equipment.index')}>
                            <ArrowLeft className='mr-2 h-4 w-4' />
                            Back to Equipment
                        </Link>
                    </Button>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight'>Add New Equipment</h1>
                        <p className='text-muted-foreground'>Add new equipment to your inventory</p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Package className='mr-2 h-5 w-5' />
                            Equipment Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className='space-y-6' onSubmit={handleSubmit}>
                            {/* Equipment Image */}
                            <div className='space-y-2'>
                                <Label htmlFor='image'>Equipment Image</Label>
                                <div className='flex flex-col space-y-4'>
                                    {imagePreview ? (
                                        <div className='relative h-32 w-32 overflow-hidden rounded-lg border-2 border-dashed border-gray-300'>
                                            <img alt='Equipment preview' className='h-full w-full object-cover' src={imagePreview} />
                                            <Button
                                                className='absolute top-1 right-1'
                                                onClick={removeImage}
                                                size='sm'
                                                type='button'
                                                variant='destructive'
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className='flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800'>
                                            <div className='text-center'>
                                                <Upload className='mx-auto h-8 w-8 text-gray-400' />
                                                <p className='mt-1 text-xs text-gray-500'>Image</p>
                                            </div>
                                        </div>
                                    )}
                                    <Input accept='image/*' className='w-fit' id='image' onChange={handleImageChange} type='file' />
                                    {errors.image && <p className='text-sm text-destructive'>{errors.image}</p>}
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='name'>Equipment Name *</Label>
                                    <Input
                                        id='name'
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder='Canon EOS R5 Camera'
                                        value={data.name}
                                    />
                                    {errors.name && <p className='text-sm text-destructive'>{errors.name}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='type'>Type *</Label>
                                    <Input id='type' onChange={(e) => setData('type', e.target.value)} placeholder='Camera' value={data.type} />
                                    {errors.type && <p className='text-sm text-destructive'>{errors.type}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='brand'>Brand *</Label>
                                    <Input id='brand' onChange={(e) => setData('brand', e.target.value)} placeholder='Canon' value={data.brand} />
                                    {errors.brand && <p className='text-sm text-destructive'>{errors.brand}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='model'>Model *</Label>
                                    <Input id='model' onChange={(e) => setData('model', e.target.value)} placeholder='EOS R5' value={data.model} />
                                    {errors.model && <p className='text-sm text-destructive'>{errors.model}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='serial_number'>Serial Number</Label>
                                    <Input
                                        id='serial_number'
                                        onChange={(e) => setData('serial_number', e.target.value)}
                                        placeholder='123456789'
                                        value={data.serial_number}
                                    />
                                    {errors.serial_number && <p className='text-sm text-destructive'>{errors.serial_number}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='division_id'>Division</Label>
                                    <Select
                                        onValueChange={(value) => setData('division_id', value === 'none' ? '' : value)}
                                        value={data.division_id || 'none'}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select division (optional)' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='none'>No division</SelectItem>
                                            {divisions.map((division) => (
                                                <SelectItem key={division.id} value={division.id.toString()}>
                                                    {division.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.division_id && <p className='text-sm text-destructive'>{errors.division_id}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className='space-y-2'>
                                <Label htmlFor='description'>Description</Label>
                                <Textarea
                                    id='description'
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder='Professional mirrorless camera with 45MP full-frame sensor...'
                                    rows={3}
                                    value={data.description}
                                />
                                {errors.description && <p className='text-sm text-destructive'>{errors.description}</p>}
                            </div>

                            {/* Purchase Information */}
                            <div className='grid gap-4 md:grid-cols-3'>
                                <div className='space-y-2'>
                                    <Label htmlFor='purchase_date'>Purchase Date</Label>
                                    <Input
                                        id='purchase_date'
                                        onChange={(e) => setData('purchase_date', e.target.value)}
                                        type='date'
                                        value={data.purchase_date}
                                    />
                                    {errors.purchase_date && <p className='text-sm text-destructive'>{errors.purchase_date}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='purchase_price'>Purchase Price</Label>
                                    <Input
                                        id='purchase_price'
                                        onChange={(e) => setData('purchase_price', e.target.value)}
                                        placeholder='3999.99'
                                        step='0.01'
                                        type='number'
                                        value={data.purchase_price}
                                    />
                                    {errors.purchase_price && <p className='text-sm text-destructive'>{errors.purchase_price}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='warranty_expires_at'>Warranty Expires</Label>
                                    <Input
                                        id='warranty_expires_at'
                                        onChange={(e) => setData('warranty_expires_at', e.target.value)}
                                        type='date'
                                        value={data.warranty_expires_at}
                                    />
                                    {errors.warranty_expires_at && <p className='text-sm text-destructive'>{errors.warranty_expires_at}</p>}
                                </div>
                            </div>

                            {/* Status and Settings */}
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='status'>Status *</Label>
                                    <Select onValueChange={(value) => setData('status', value)} value={data.status}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select status' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className='text-sm text-destructive'>{errors.status}</p>}
                                </div>

                                <div className='flex items-center space-x-2 pt-8'>
                                    <Checkbox
                                        checked={data.is_available_for_borrowing}
                                        id='is_available_for_borrowing'
                                        onCheckedChange={(checked) => setData('is_available_for_borrowing', Boolean(checked))}
                                    />
                                    <Label htmlFor='is_available_for_borrowing'>Available for borrowing</Label>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className='space-y-2'>
                                <Label htmlFor='notes'>Notes</Label>
                                <Textarea
                                    id='notes'
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder='Additional notes or special instructions...'
                                    rows={3}
                                    value={data.notes}
                                />
                                {errors.notes && <p className='text-sm text-destructive'>{errors.notes}</p>}
                            </div>

                            {/* Submit */}
                            <div className='flex items-center space-x-4 pt-4'>
                                <Button disabled={processing} type='submit'>
                                    {processing ? 'Creating...' : 'Create Equipment'}
                                </Button>
                                <Button asChild type='button' variant='outline'>
                                    <Link href={route('equipment.index')}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
