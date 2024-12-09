import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newElement = await prisma.elementTreeData.create({
            data: {
                ...body,
                name: body.name,
                savedNodeIds: body.savedNodeIds
            },
        });
        return new NextResponse(JSON.stringify(newElement), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create element' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET() {
    const elements = await prisma.elementTreeData.findMany();
    return NextResponse.json({data: elements});
}