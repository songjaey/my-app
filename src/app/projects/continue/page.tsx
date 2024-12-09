'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import { Project } from '@prisma/client';


export default function Continue() {
    const navigation = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);

    const handleContinue = (projectId: string) => {
        navigation.push(`/projects/new/workspace?id=${projectId}`);
    };

    useEffect(() => {
        const readProjectData = async () => {
            try {
                const res = await fetch('../api/project');
                const projectData = await res.json();
                
                if (projectData.data && Array.isArray(projectData.data)) {
                    setProjects(projectData.data);
                    // const nodeIds = projectData.data[dataLength - 1].savedNodeIds
                    //     .split(',')
                    //     .map(Number);
                    // setNodeDataIdx(nodeIds);
                }
                //console.log(projectData);
            } catch (error) {
                console.error('Error fetching project datareadProjectData:', error);
            }
        }
        readProjectData();
       
    }, []);

    return(
        <div>
           {projects.map((project, index) => (
             <button
                key={index}
                onClick={() => handleContinue(String(project.id))}
                className="px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-600"
             >
                Project {project.id}
             </button>
           ))}
        </div>
    );
}