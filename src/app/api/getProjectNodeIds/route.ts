

// export async function GET(req: NextRequest, res: NextResponse) {
//     const projects = await prisma.project.findMany();
//     const projectIds = projects.map((project) => project.savedNodeIds);


//     const numberArray : number[] = projectIds.map((str) => parseInt(str, 10));
//     const nodes = await prisma.nodeTreeData.findMany({
//         where: {
//             id: {
//                 in: numberArray  
//             }
//         }
//     });

//     if (nodes.length === 0) {
//         console.log("No node data available");
//         return NextResponse.json({ message: "No node data available" }, { status: 404 });
//     } else {
//         return NextResponse.json({ data: nodes });
//     }

// }