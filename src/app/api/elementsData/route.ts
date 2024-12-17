import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma/prisma';
import { Element, Node } from "@/interfaces";


export async function POST(req: NextRequest) {
    const newElements = [];
    try {
        const body = await req.json();

        const nodeData = await prisma.elementTreeData.createMany({
            data: body.map((element: Element) => ({
                name: element.name,
                projectId: element.projectId,
            }))
        });

        console.log('NodeData', nodeData);
        for (const element of body) {
            await prisma.nodeTreeData.createMany({
                data: element.nodes.map((node: Node) => ({
                    id: node.id,
                    name: node.name,
                    coordinateX: node.coordinateX,
                    coordinateY: node.coordinateY,
                    coordinateZ: node.coordinateZ,
                    projectId: node.projectId,
                }))
            });
        }

        const createdElements = await prisma.elementTreeData.findMany({
            where: {
                projectId: body[0].projectId,
            }
        });
        
        const createdNodes = await prisma.nodeTreeData.findMany({
            where: {
                projectId: body[0].projectId,
            }
        });

        const combinedData = createdElements.map(element => ({
            ...element,
            nodes: createdNodes.filter(node => node.projectId === element.projectId)
        }));


        return new NextResponse(JSON.stringify(combinedData), {
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