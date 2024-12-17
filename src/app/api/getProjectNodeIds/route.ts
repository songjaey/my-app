import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../../prisma/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const savedNodeData = await prisma.project.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            nodes: {
                select: {
                    id: true,
                    name: true,
                    coordinateX: true,
                    coordinateY: true,
                    coordinateZ: true,
                }
            }
        }
    });
    console.log('savedNodeIds!!!', savedNodeData);

    // const numberArray: number[] = savedNodeIds
    // ? savedNodeIds.split(',')
    //     .map((str: string) => (str !== null ? parseInt(str, 10) : null))
    //     .filter((num: number | null): num is number => num !== null)
    // : [];
    // // console.log(numberArray);
    // // const nodes = await prisma.nodeTreeData.findMany({
    // //     where: {
    // //         id: {
    // //             in: numberArray  
    // //         }
    // //     }
    // // });
    // console.log('numberArray!!!', numberArray);

    if (savedNodeData === null) {
        console.log("No node data available");
        // return NextApiRequest.json({ message: "No node data available" }, { status: 404 });
    } else {
        return new Response(JSON.stringify({ data: savedNodeData }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

}