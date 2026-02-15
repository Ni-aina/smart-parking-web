import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { summaryData, bookingsLastWeek } = data;

        const workbook = new ExcelJS.Workbook();

        const summarySheet = workbook.addWorksheet("Summary");
        if (summaryData && summaryData.length > 0) {
            summarySheet.columns = Object.keys(summaryData[0]).map(key => ({
                header: key,
                key: key,
                width: 15
            }))
            summarySheet.addRows(summaryData);
        }

        const bookingsSheet = workbook.addWorksheet("BookingsLastWeek");
        if (bookingsLastWeek && bookingsLastWeek.length > 0) {
            bookingsSheet.columns = Object.keys(bookingsLastWeek[0]).map(key => ({
                header: key,
                key: key,
                width: 15
            }))
            bookingsSheet.addRows(bookingsLastWeek);
        }

        const buffer = await workbook.xlsx.writeBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=dashboard-report.xlsx"
            }
        })
    } catch (error) {
        console.error("Excel generation error:", error);
        return NextResponse.json({ 
            error: "Failed to generate Excel" 
        }, { 
            status: 500 
        })
    }
}