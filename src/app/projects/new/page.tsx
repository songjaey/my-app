'use client'
import { useState, useEffect } from 'react';
import { Project } from "@prisma/client";
import Link from 'next/link'


export default function Start() {
    const [inputTitle, setInputTitle] = useState("");
    const [projectId, setProjectId] = useState<number>(1);

    useEffect(() => {
        const readProjectData = async () => {
            try {
                const res = await fetch('../api/project');
                const project = await res.json();
                if (project.data.length > 0){
                    setProjectId(project.data.length + 1);
                }
                console.log(project.data.length + 1);
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };
        readProjectData();
    },[]);

    const handleCreateProject = async ( data: Omit<Project, 'id' | 'createdAt'> ) => {

        const sendData = { ...data };
        const response = await (await fetch('../api/project', {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: {
                "Content-Type": "application/json",
            },
        })).json();

        if(response.errors) {
            console.log(response.errors);
            return;
        }
    }


    return(
        <div className='flex flex-col justify-center items-center space-y-5 border border-red-500 p-10'>
            <div className='w-4/5 flex flex-row justify-between'>
                <div className='text-left'>Project ID</div>
                <p className='w-16 text-gray-600'>{projectId}</p>
            </div>
            <div className='flex flex-row justify-between'>
                <div className='px-9 text-left'>Project Name</div>
                <input
                    type="text"
                    placeholder='Enter Project Name'
                    className='placeholder-gray-400 bg-opacity-50 border border-gray-500'
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)} 
                />
            </div>
            {/* <button
                
            >TEST</button> */}
            <Link
                onClick={() =>
                    handleCreateProject({
                        title: inputTitle,
                        isSaved: true,
                        imageSrc: '',
                        savedNodeIds: '',
                        savedElementIds: '',
                    })
                }
                href="new/workspace"
                className="px-10 py-2 my-20 w-1/2 text-center bg-green-500 text-white rounded-md hover:bg-green-600 bg-opacity-50"
            >
                Start a Project
            </Link>
        </div>
    );
}