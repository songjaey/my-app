'use client';
import Link from "next/link";
import { useEffect, useState } from 'react';

export default function Header(){
    const [isLoading, setIsLoading] = useState(false);
    const [lastProjectId, setLastProjectId] = useState(0);
    const [lastProjectDate, setlastProjectDate] = useState();

    useEffect(() => {
        const searchProjectData = async () => {
            try{
                setIsLoading(true);
                const res = await fetch('/api/project');
                const projectData = await res.json();
                if (projectData.data && projectData.data.length > 0) {
                    setLastProjectId(projectData.data.length);
                    // 마지막 프로젝트의 업데이트 날짜 설정
                    const lastProject = projectData.data[projectData.data.length - 1];
                    if (lastProject) {
                        setlastProjectDate(lastProject.updatedAt);
                    }
                }
            }catch(error){
                console.log('Project Reading Error',error);
            }finally{
                setIsLoading(false);
            }
        }
        searchProjectData();
    },[]);

    return (
        <header>
            <div>
                <div>
                    <Link href="/">
                        <h1>Home</h1>
                    </Link>
                    <Link href="/projects/continue">
                        <h1>Projects</h1>
                    </Link>
                    <Link href="/projects/new">
                        <h1>New Project</h1>
                    </Link>
                </div>
                <div>
                    <h2>Total project Number: {lastProjectId}</h2>
                    <h2>Recent work date: {lastProjectDate}</h2>
                </div>
            </div>

        </header>
    );
}