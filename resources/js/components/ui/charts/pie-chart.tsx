import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChartData {
    name: string;
    value: number;
    color?: string;
}

interface CustomPieChartProps {
    data: PieChartData[];
    dataKey: string;
    nameKey: string;
    height?: number;
    showLegend?: boolean;
    innerRadius?: number;
    outerRadius?: number;
    className?: string;
    colors?: string[];
}

const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'];

export function CustomPieChart({
    data,
    dataKey,
    nameKey,
    height = 300,
    showLegend = true,
    innerRadius = 0,
    outerRadius = 80,
    className = '',
    colors = DEFAULT_COLORS,
}: CustomPieChartProps) {
    return (
        <div className={`w-full ${className}`}>
            <ResponsiveContainer width='100%' height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        cx='50%'
                        cy='50%'
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={2}
                        dataKey={dataKey}
                        nameKey={nameKey}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            // backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                        }}
                    />
                    {showLegend && <Legend verticalAlign='bottom' height={36} wrapperStyle={{ fontSize: '12px' }} />}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
