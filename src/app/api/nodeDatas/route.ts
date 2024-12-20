import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma/prisma';
import { Node } from "@/interfaces";


export async function POST(req: NextRequest, res: NextResponse) {
    console.log('post')
    const body = await req.json();
    console.log(body);
    // [{}, {}]

    // const test = body.map((node: Node) => ({
    //          name: node.name,
    //          coordinateX: node.coordinateX,
    //          coordinateY: node.coordinateY,
    //          coordinateZ: node.coordinateZ,
    //          projectId: node.projectId
    //      }))

    try {
        const newNodes = await prisma.nodeTreeData.createMany({
            data: body.map((node: Node) => ({
                name: node.name,
                coordinateX: node.coordinateX,
                coordinateY: node.coordinateY,
                coordinateZ: node.coordinateZ,
                projectId: node.projectId,
            }))
        });
        console.log('newNodes',newNodes);
        return new NextResponse(JSON.stringify(newNodes), {
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
