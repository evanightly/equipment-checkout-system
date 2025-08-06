import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LineChartData {
    [key: string]: string | number;
}

interface CustomLineChartProps {
    data: LineChartData[];
    xAxisKey: string;
    lines: Array<{
        dataKey: string;
        stroke: string;
        name: string;
    }>;
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    className?: string;
}

export function CustomLineChart({ data, xAxisKey, lines, height = 300, showGrid = true, showLegend = true, className = '' }: CustomLineChartProps) {
    return (
        <div className={`w-full ${className}`}>
            <ResponsiveContainer width='100%' height={height}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    {lines.map((line, index) => (
                        <Line
                            key={index}
                            type='monotone'
                            dataKey={line.dataKey}
                            stroke={line.stroke}
                            strokeWidth={2}
                            dot={{ fill: line.stroke, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: line.stroke, strokeWidth: 2 }}
                            name={line.name}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
