import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Filter, Search, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterFieldConfig {
    key: string;
    label: string;
    type: 'select' | 'search';
    placeholder?: string;
    options?: FilterOption[];
    allLabel?: string; // Label for "all" option in select
}

interface StandardFiltersProps {
    fields: FilterFieldConfig[];
    filters: Record<string, string | undefined>;
    routeName: string;
    onSearch?: () => void;
    onClear?: () => void;
    className?: string;
}

export function StandardFilters({ fields, filters, routeName, onSearch, onClear, className = '' }: StandardFiltersProps) {
    const [localFilters, setLocalFilters] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        fields.forEach((field) => {
            if (field.type === 'search') {
                initial[field.key] = filters[field.key] || '';
            } else {
                initial[field.key] = filters[field.key] || 'all';
            }
        });
        return initial;
    });

    const handleSearch = () => {
        const searchParams: Record<string, string | undefined> = {};

        fields.forEach((field) => {
            const value = localFilters[field.key];
            if (field.type === 'search') {
                searchParams[field.key] = value || undefined;
            } else {
                searchParams[field.key] = value !== 'all' ? value : undefined;
            }
        });

        // Preserve pagination settings
        const urlParams = new URLSearchParams(window.location.search);
        const currentPerPage = urlParams.get('per_page');
        if (currentPerPage) {
            searchParams.per_page = currentPerPage;
        }

        router.get(route(routeName), searchParams, {
            preserveState: true,
            preserveScroll: true,
        });

        onSearch?.();
    };

    const handleClear = () => {
        const clearedFilters: Record<string, string> = {};
        fields.forEach((field) => {
            if (field.type === 'search') {
                clearedFilters[field.key] = '';
            } else {
                clearedFilters[field.key] = 'all';
            }
        });
        setLocalFilters(clearedFilters);

        router.get(route(routeName));
        onClear?.();
    };

    const updateFilter = (key: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const hasActiveFilters = fields.some((field) => {
        const value = localFilters[field.key];
        return field.type === 'search' ? !!value : value !== 'all';
    });

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Filter className='h-5 w-5' />
                    Filters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-4'>
                    {/* Filter Fields Row */}
                    <div className='flex flex-wrap items-end gap-4'>
                        {fields.map((field) => (
                            <div key={field.key} className={`min-w-0 ${field.type === 'search' ? 'min-w-[250px] flex-1' : 'min-w-[150px]'}`}>
                                <label className='mb-2 block text-sm font-medium'>{field.label}</label>
                                {field.type === 'search' ? (
                                    <div className='relative'>
                                        <Search className='absolute top-3 left-3 h-4 w-4 text-muted-foreground' />
                                        <Input
                                            className='pl-10'
                                            onChange={(e) => updateFilter(field.key, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder={field.placeholder}
                                            value={localFilters[field.key]}
                                        />
                                    </div>
                                ) : (
                                    <Select onValueChange={(value) => updateFilter(field.key, value)} value={localFilters[field.key]}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={field.allLabel || 'All'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='all'>{field.allLabel || 'All'}</SelectItem>
                                            {field.options?.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        ))}

                        {/* Action Buttons - Always at the end */}
                        <div className='ml-auto flex items-end gap-2'>
                            <Button onClick={handleSearch}>
                                <Search className='mr-2 h-4 w-4' />
                                Search
                            </Button>
                            {hasActiveFilters && (
                                <Button onClick={handleClear} variant='outline'>
                                    <X className='mr-2 h-4 w-4' />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active Filter Badges */}
                {hasActiveFilters && (
                    <div className='mt-4 flex flex-wrap gap-2'>
                        {fields.map((field) => {
                            const value = localFilters[field.key];
                            const shouldShow = field.type === 'search' ? !!value : value !== 'all';

                            if (!shouldShow) return null;

                            const displayValue = field.type === 'search' ? value : field.options?.find((opt) => opt.value === value)?.label || value;

                            return (
                                <Badge key={field.key} className='flex items-center gap-1' variant='secondary'>
                                    {field.label}: {displayValue}
                                </Badge>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
