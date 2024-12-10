import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../../prisma/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const projectData = await prisma.project.findMany({
        where: {
            id: Number(id)
        }
    });
    console.log(id);
    console.log('projectDATA!!!', projectData);

    const savedNodeIds = projectData[0].savedNodeIds;
    console.log('savedNodeIds!!!', savedNodeIds);
    const numberArray: number[] = savedNodeIds
    ? savedNodeIds.split(',')
        .map((str: string) => (str !== null ? parseInt(str, 10) : null))
        .filter((num: number | null): num is number => num !== null)
    : [];
    // console.log(numberArray);
    // const nodes = await prisma.nodeTreeData.findMany({
    //     where: {
    //         id: {
    //             in: numberArray  
    //         }
    //     }
    // });
    console.log('numberArray!!!', numberArray);

    const nodes = await prisma.nodeTreeData.findMany({
        where: {
            id: {
                in: numberArray  
            }
        }
    });

    if (numberArray.length === 0) {
        console.log("No node data available");
        // return NextApiRequest.json({ message: "No node data available" }, { status: 404 });
    } else {
        return new Response(JSON.stringify({ data: nodes }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

}