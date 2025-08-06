import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Division } from './columns';

interface DivisionEditProps {
    division: Division;
}

export default function DivisionEdit({ division }: DivisionEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: division.name || '',
        code: division.code || '',
        description: division.description || '',
        is_active: division.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('divisions.update', division.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit Division - ${division.name}`} />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center gap-4'>
                    <Link href={route('divisions.index')}>
                        <Button size='icon' variant='outline'>
                            <ArrowLeft className='h-4 w-4' />
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Edit Division</h1>
                        <p className='text-muted-foreground'>Update division information for {division.name}</p>
                    </div>
                </div>

                {/* Form */}
                <Card className='max-w-2xl'>
                    <CardHeader>
                        <CardTitle>Division Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className='space-y-6' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='name'>Division Name*</Label>
                                    <Input
                                        autoFocus
                                        className={errors.name ? 'border-red-500' : ''}
                                        id='name'
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder='Enter division name'
                                        value={data.name}
                                    />
                                    {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='code'>Division Code*</Label>
                                    <Input
                                        className={errors.code ? 'border-red-500' : ''}
                                        id='code'
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder='Enter division code (e.g., NEWS)'
                                        value={data.code}
                                    />
                                    {errors.code && <p className='text-sm text-red-500'>{errors.code}</p>}
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='description'>Description</Label>
                                <Textarea
                                    className={errors.description ? 'border-red-500' : ''}
                                    id='description'
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder='Enter division description (optional)'
                                    rows={3}
                                    value={data.description}
                                />
                                {errors.description && <p className='text-sm text-red-500'>{errors.description}</p>}
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    checked={data.is_active}
                                    id='is_active'
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label className='text-sm font-medium' htmlFor='is_active'>
                                    Active Division
                                </Label>
                            </div>

                            <div className='flex gap-4 pt-4'>
                                <Button className='flex items-center gap-2' disabled={processing} type='submit'>
                                    <Save className='h-4 w-4' />
                                    {processing ? 'Updating...' : 'Update Division'}
                                </Button>
                                <Link href={route('divisions.index')}>
                                    <Button type='button' variant='outline'>
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
