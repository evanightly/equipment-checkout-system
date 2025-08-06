import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon, Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number | string;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
    icon: LucideIcon;
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
    className?: string;
    delay?: number;
}

const colorVariants = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
};

const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
};

const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    stable: 'text-gray-600 dark:text-gray-400',
};

export function StatsCard({ title, value, change, trend = 'stable', icon: Icon, color = 'blue', className = '', delay = 0 }: StatsCardProps) {
    const TrendIcon = trendIcons[trend];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} className={className}>
            <Card className='relative overflow-hidden'>
                <div className={`absolute inset-0 bg-gradient-to-br ${colorVariants[color]} opacity-5`} />
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
                    <div className={`rounded-lg bg-gradient-to-br p-2 ${colorVariants[color]} bg-opacity-10`}>
                        <Icon className={`h-4 w-4 text-white`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{value}</div>
                    {change && (
                        <div className='flex items-center space-x-1 text-xs'>
                            <TrendIcon className={`h-3 w-3 ${trendColors[trend]}`} />
                            <span className={trendColors[trend]}>{change} from last month</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
