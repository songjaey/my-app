'use server';
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export async function createProject(title: string) {
    return await prisma.project.create({
       data: {
            title,
            imageSrc: "",
            isSaved: true,
            savedNodeIds: "",
            savedElementIds: ""
       } 
    });
}