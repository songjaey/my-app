import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma/prisma';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();

        const newNode = await prisma.nodeTreeData.create({
            data: {
                ...body,
                name: body.name,
                coordinateX: body.coordinateX,
                coordinateY: body.coordinateY,
                coordinateZ: body.coordinateZ,
            },
        });
        return new NextResponse(JSON.stringify(newNode), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create node' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET() {
    try {
        const nodes = await prisma.nodeTreeData.findMany();
        //console.log('nodes', nodes);
        if (nodes.length === 0) {
            console.log("No node data available");
            return NextResponse.json({ message: "No node data available" }, { status: 404 });
        }

        return NextResponse.json({ data: nodes });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        return NextResponse.json({ error: 'Failed to fetch nodes' }, { status: 500 });
    }
}
