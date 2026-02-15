"use client";

import {
    Area,
    AreaChart,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const AreaChartDashboard = ({ 
    isAnimationActive = true,
    bookingsLastWeek = []
}: {
    isAnimationActive?: boolean
    bookingsLastWeek: Array<{ day: string; booking: number; }>
}) => (
    <AreaChart
        style={{ width: "100%", maxWidth: "700px", maxHeight: "45vh", aspectRatio: 1.618 }}
        responsive
        data={bookingsLastWeek}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
    >
        <defs>
            <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
        </defs>
        <XAxis dataKey="day" />
        <YAxis width="auto" allowDecimals={false} />
        <Tooltip />
        <Area
            type="monotone"
            dataKey="booking"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorBooking)"
            isAnimationActive={isAnimationActive}
        />
    </AreaChart>
)

export default AreaChartDashboard;