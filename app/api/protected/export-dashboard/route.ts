import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { 
            summaryData, 
            bookingsLastWeek,
            occupancyLots,
            sheetNames
        } = data;

        const workbook = new ExcelJS.Workbook();

        const summarySheet = workbook.addWorksheet(sheetNames?.summary || "Summary");
        if (summaryData && summaryData.length > 0) {
            summarySheet.columns = Object.keys(summaryData[0]).map(key => ({
                header: key,
                key: key,
                width: 15
            }))
            summarySheet.addRows(summaryData);
        }

        const bookingsSheet = workbook.addWorksheet(sheetNames?.bookingsLastWeek || "Bookings Last Week");
        if (bookingsLastWeek && bookingsLastWeek.length > 0) {
            bookingsSheet.columns = Object.keys(bookingsLastWeek[0]).map(key => ({
                header: key,
                key: key,
                width: 15
            }))
            bookingsSheet.addRows(bookingsLastWeek);
        }

        const pieChartSheet = workbook.addWorksheet(sheetNames?.occupancyLots || "Occupancy Lots");
        if (occupancyLots && occupancyLots.length > 0) {
            pieChartSheet.columns = Object.keys(occupancyLots[0]).map(key => ({
                header: key,
                key: key,
                width: 15
            }))
            pieChartSheet.addRows(occupancyLots);
        }

        const buffer = await workbook.xlsx.writeBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=dashboard-report.xlsx"
            }
        })
    } catch (error: any) {
        return NextResponse.json({ 
            error: `Failed to generate Excel file: ${error.message}` 
        }, { 
            status: 500 
        })
    }
}
