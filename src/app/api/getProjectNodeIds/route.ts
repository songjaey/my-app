import prisma from '../../../../prisma/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const savedData = await prisma.project.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            nodes: {
                select: {
                    id: true,
                    name: true,
                    x: true,
                    y: true,
                    z: true,
                }
            },
            elements: {
                select: {
                    id: true,
                    name: true,    
                }
            }
        }
    });
    console.log('savedData!!!', savedData);

    const responseData = savedData === null ? { nodes: [], element: [] } : savedData; 

    return new Response(JSON.stringify({
        data: responseData,
        message: savedData === null ? "No node data available" : "Data found"
    }),{
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })

}