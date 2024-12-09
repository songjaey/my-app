import { NextResponse } from "next/server";
import prisma from '../../../../prisma/prisma';

export async function GET() {
    try {
        const count = await prisma.nodeTreeData.count();
        
        if (count === 0) {
            return NextResponse.json({ message: "No nodes available" }, { status: 404 });
        }

        return NextResponse.json({ totalCount: count });
    } catch (error) {
        console.error('Error counting nodes:', error);
        return NextResponse.json({ error: 'Failed to count nodes' }, { status: 500 });
    }
}