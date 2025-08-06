import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface BarChartData {
    [key: string]: string | number;
}

interface CustomBarChartProps {
    data: BarChartData[];
    xAxisKey: string;
    bars: Array<{
        dataKey: string;
        fill: string;
        name: string;
    }>;
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    className?: string;
}

export function CustomBarChart({ data, xAxisKey, bars, height = 300, showGrid = true, showLegend = true, className = '' }: CustomBarChartProps) {
    return (
        <div className={`w-full ${className}`}>
            <ResponsiveContainer width='100%' height={height}>
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    {showGrid && <CartesianGrid strokeDasharray='3 3' className='opacity-30' />}
                    <XAxis dataKey={xAxisKey} className='text-xs' axisLine={false} tickLine={false} />
                    <YAxis className='text-xs' axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{
                            // backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            // color: 'white',
                        }}
                    />
                    {showLegend && <Legend />}
                    {bars.map((bar, index) => (
                        <Bar key={index} dataKey={bar.dataKey} fill={bar.fill} name={bar.name} radius={[4, 4, 0, 0]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
