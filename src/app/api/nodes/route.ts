import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // 요청에서 JSON 데이터를 파싱
    const body = await req.json();
    //console.log('Raw body : ', body);

    const existingNodes = await prisma.node.findMany({
      where: {
        projectId: body[0].projectId
      }
    });
    const newNodes = await prisma.node.createMany({
      data: body.map((node: any) => ({
          name: node.name,
          x: node.x,
          y: node.y,
          z: node.z,
          projectId: node.projectId
      }))
    });

    return NextResponse.json(newNodes, { status: 201 });
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json({ error: 'Failed to create node' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try{
    const body = await req.json();

    console.log('body',body);

    const projectId = body[0].projectId;

    await prisma.node.deleteMany({
      where: {
        projectId: projectId  
      }
    })

    const newNodes = await prisma.node.createMany({
      data: body.map((node: any) => ({
        name: node.name,
        x: node.x,
        y: node.y,
        z: node.z,
        projectId: node.projectId
      }))
    });

    return NextResponse.json(newNodes, { status: 201 });
  } catch(error) {
    console.error('Error updating nodes:', error);
    return NextResponse.json({ error: 'Failed to update nodes' }, { status: 500 });
  }
}
