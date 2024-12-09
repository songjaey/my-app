import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma/prisma';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const newProject = await prisma.project.create({
            data: {
                ...body,
                title: body.title,
                imageSrc: body.imageSrc,
                isSaved: body.isSaved,   
                savedNodeIds: body.savedNodeIds,
                savedElementIds: body.savedElementIds,
            },
        });
        return new NextResponse(JSON.stringify(newProject), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create project' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    const projects = await prisma.project.findMany();
    return NextResponse.json({data: projects});
}

export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        console.log('body : ', body);
        const updatedResource = await prisma.project.update({
            where: { id: body.id },
            data: {
                ...body,
                savedNodeIds: body.savedNodeIds,
                savedElementIds: body.savedElementIds,
            },
        });
        //console.log('updatedResource : ', updatedResource);
        return NextResponse.json(updatedResource);
    } catch (error) {
        console.error('Error updating resource:', error);
        return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 });
    }
}
