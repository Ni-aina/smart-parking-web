"use client";

import { 
    Pie, 
    PieChart, 
    PieLabelRenderProps, 
    PieSectorShapeProps, 
    Sector 
} from "recharts";
import { useTranslation } from "@/context/LanguageContext";

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
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center space-y-2">
            <h1 className="text-white text-lg lg:text-3xl font-semibold">
                {t("dashboard.occupancyRate")}
            </h1>
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
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#5CFA90]" />
                    <span className="text-white">
                        {t("dashboard.status.occupied")}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF8042]" />
                    <span className="text-white">
                        {t("dashboard.status.available")}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PieChartDashboard;
