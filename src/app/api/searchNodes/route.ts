import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma/prisma';

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const nodeIds = body.id;
    const nodes = await prisma.nodeTreeData.findMany({
        where: {
            id: {
                in: nodeIds  
            }
        }
    });
    if (nodes.length === 0) {
        console.log("No node data available");
        return NextResponse.json({ message: "No node data available" }, { status: 404 });
    } else {
        return NextResponse.json({ data: nodes });
    }
}
