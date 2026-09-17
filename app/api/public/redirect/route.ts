import { NextRequest, NextResponse } from "next/server"

export const GET = (req: NextRequest) => {
    const id = req.nextUrl.searchParams.get("id")
    const url = `SmartParking://lotDetails/${id}`

    return new NextResponse(
        `<html><body><script>window.location.href="${url}"</script></body></html>`,
        {
            headers: {
                "Content-Type": "text/html"
            }
        }
    )
}