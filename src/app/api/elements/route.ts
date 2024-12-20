import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   try {
//     const existingElements = await prisma.element.findMany({
//       where: {
//         projectId: bod
//       }
//     })
//   } catch (error) {
//     console.error('Error creating element:', error);
//     return NextResponse.json({ error: 'Failed to create element' }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    // 요청 데이터 파싱
    const body = await req.json();
    //const { type, projectId, nodes } = body;

    // // 필드 유효성 검사
    // if (!type || !projectId || !Array.isArray(nodes) || nodes.length === 0) {
    //   return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    // }

    // 새로운 Element 생성 및 Node 관계 설정
    console.log('element body ', body[0]);

    const validNodeIds = await prisma.node.findMany({
      where: {
        id: { in: body[0].nodeIds },
      },
      select: { id: true },
    });

    console.log('validNodeIds', validNodeIds);

    const newElement = await prisma.element.create({
      data: {
        name: body[0].name,
        projectId: body[0].projectId,
        nodes: {
          connect: validNodeIds.map((node) => ({ id: node.id })),
        },
      },
      include: {
        nodes: true, // 연결된 Nodes 포함
      },
    });

    return NextResponse.json(newElement, { status: 201 });
  } catch (error) {
    console.error('Error creating element:', error);
    return NextResponse.json({ error: 'Failed to create element' }, { status: 500 });
  }
}
