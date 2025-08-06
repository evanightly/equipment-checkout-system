import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function DivisionCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        is_active: true as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('divisions.store'));
    };

    return (
        <AppLayout>
            <Head title='Create Division' />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center gap-4'>
                    <Link href={route('divisions.index')}>
                        <Button size='icon' variant='outline'>
                            <ArrowLeft className='h-4 w-4' />
                        </Button>
                    </Link>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Create Division</h1>
                        <p className='text-muted-foreground'>Add a new organizational division</p>
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
                                    <Label htmlFor='name'>Division Name *</Label>
                                    <Input
                                        id='name'
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder='e.g., News Division'
                                        required
                                        value={data.name}
                                    />
                                    {errors.name && <p className='text-sm text-destructive'>{errors.name}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='code'>Division Code *</Label>
                                    <Input
                                        id='code'
                                        maxLength={10}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder='e.g., NEWS'
                                        required
                                        value={data.code}
                                    />
                                    {errors.code && <p className='text-sm text-destructive'>{errors.code}</p>}
                                    <p className='text-xs text-muted-foreground'>Short code for the division (max 10 characters)</p>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='description'>Description</Label>
                                <Textarea
                                    id='description'
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder='Brief description of the division...'
                                    rows={3}
                                    value={data.description}
                                />
                                {errors.description && <p className='text-sm text-destructive'>{errors.description}</p>}
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    checked={data.is_active}
                                    id='is_active'
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor='is_active'>Active Division</Label>
                            </div>

                            <div className='flex items-center gap-4 pt-4'>
                                <Button disabled={processing} type='submit'>
                                    <Save className='mr-2 h-4 w-4' />
                                    {processing ? 'Creating...' : 'Create Division'}
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
