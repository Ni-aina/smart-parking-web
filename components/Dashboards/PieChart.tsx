"use client";

import { 
    Pie, 
    PieChart, 
    PieLabelRenderProps, 
    PieSectorShapeProps, 
    Sector 
} from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = ["#5CFA90", "#FF8042"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > ncx ? "start" : "end"} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    )
}

const MyCustomPie = (props: PieSectorShapeProps) => {
    return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
}

const PieChartDashboard = (
    { 
        isAnimationActive = true,
        piechartData = []
    }: 
    { 
        isAnimationActive?: boolean,
        piechartData?: { name: string; value: number }[]
    }
) => {

    return (
        <PieChart
            style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "80vh",
                aspectRatio: 1
            }}
            responsive
        >
            <Pie
                data={piechartData}
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={isAnimationActive}
                shape={MyCustomPie}
            />
        </PieChart>
    )
}

export default PieChartDashboard;