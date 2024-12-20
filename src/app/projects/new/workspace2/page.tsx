'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSearchParams } from 'next/navigation';
import NodeDialog from '@/app/components/node-dialog';
import ElementDialog from '@/app/components/element-dialog';
import ResultModal from '@/app/components/result';
import Sidebar from '@/app/components/sidebar';
import { Element, Node, Result } from '@/interfaces';
import { Project } from '@prisma/client';

export default function Workspace(){

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const id_num = Number(id);

    const [isInitialized, setIsInitialized] = useState(false);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.Camera | null>(null);
    const linesRef = useRef<THREE.Line[]>([]);

    const [nodeModalIsOpen, setNodeModalIsOpen] = useState(false);
    const [elementModalIsOpen, setElementModalIsOpen] = useState(false);
    const [resultModalIsOpen, setResultModalIsOpen] = useState(false);
    const [isExcuting, setIsExcuting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [elements, setElements] = useState<Element[]>([]);
    const [result, setResult] = useState<Result | null>(null);

    useEffect(() => {
        if(!mountRef.current) return;
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xcccccc, 0.5);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        renderer.render(scene, camera);
        setIsInitialized(true);
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        const searchData = async () => {
            const id_temp = String(id_num);
            const res = await fetch(`../../api/getProjectNodeIds?id=${id_temp}`);
            const dataArray = await res.json();
            if (dataArray.data.nodes && Array.isArray(dataArray.data.nodes)) {
                console.log('nodeDataArray', dataArray.data.nodes[0]);
                const mappedNodes = dataArray.data.nodes.map((nodeData: any) => ({
                    id: nodeData.id - 1,
                    name: nodeData.name,
                    x: nodeData.x,
                    y: nodeData.y,
                    z: nodeData.z,
                }));

                setNodes((prev) => [
                    ...prev,
                    ...mappedNodes.map((node: any) => ({
                        id: node.id,
                        name: node.name,
                        coordinateX: node.x,
                        coordinateY: node.y,
                        coordinateZ: node.z,
                        projectId: id_num
                    }))
                ]); 
            }
            if (dataArray.data.elements && Array.isArray(dataArray.data.elements)) {
                console.log('elementDataArray', dataArray.data.elements[0]);
                const mappedElements = dataArray.data.elements.map((elementData: any) => ({
                    id: elementData.id - 1,
                    name: elementData.name,
                }));
                setElements((prev) => [
                    ...prev,
                    ...mappedElements.map((node: any) => ({
                        id: node.id,
                        name: node.name,
                        projectId: id_num,
                    }))
                ]); 
            }
        }
        searchData();
    }, []);

    const handleNodeOK = async ( X: number, Y: number, Z: number ) => {
        setNodes(prev => {
            const maxId = Math.max(...prev.map(node => node.id), -1);
            const newNodes = [...prev, {
                id: maxId + 1,
                name: 'node' + String(prev.length + 1),
                coordinateX: X,
                coordinateY: Y,
                coordinateZ: Z,
                projectId: id_num
            }];
            return newNodes;
        });
    };

    const handleNodeCancel = () => {
        setNodeModalIsOpen(false);
    }

    const handleElementCancel = () => {
        setElementModalIsOpen(false);
    }

    const handleResultCancel = () => {
        setResultModalIsOpen(false);
        setIsCompleted(false);
    }

    function calculateSelectedPoints (nodeIds: number[]) {
        const selectedPoints: number[] = [];
        console.log('nodeIds', nodeIds);
        console.log('nodes', nodes);
        for(let i = 0; i < nodeIds.length; i++) {
            const idx = nodes.findIndex((node: Node) => node.id === nodeIds[i]);
            selectedPoints[i] = idx;
        }
        console.log('selectedPoints', selectedPoints);
        return selectedPoints;
    };
    
    function processSelectedPoints(SelectedNodes: number[]) {
        const points: THREE.Vector3[] = [];
        console.log('updatedSelectedNodes',SelectedNodes);
        SelectedNodes.forEach((pointIndex) => {
            console.log('processing index:', pointIndex - 1); 
            const node = nodes[pointIndex];
            points.push(new THREE.Vector3(node.coordinateX, node.coordinateY, node.coordinateZ));
        });
        points.push(points[0]);
        return points;
    }

    function drawPoints(points: THREE.Vector3[]){
        const material = new THREE.LineBasicMaterial( {color:0x0000ff} );
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        linesRef.current.push(line);
        if (sceneRef.current && rendererRef.current && cameraRef.current) {
            sceneRef.current.add(line);
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        } else {
            console.error('error!');
        }
    }

    function saveElementData(selectedNodes: number[]) {
        console.log('selectedNodes',selectedNodes);
        setElements(prev => [...prev, {
            id: elements.length,
            name: 'element' + String(elements.length),
            projectId: id_num,
            nodeIds: selectedNodes
        }]);
    }

    const handleUpdateProject = async ( data: Omit<Project, 'title' | 'isSaved' | 'imageSrc'> ) => {
        console.log('data : ', data);
        const sendData = { ...data };
        const response = (await fetch('/api/project', {
            method:"PUT",
            body: JSON.stringify(sendData),
            headers: {
                "Content-Type": "application/json",
            },
        }));
        console.log(response);
    }

    const handleElementOK = async (nodeIds: number[]) => {
        if (!isInitialized) {
            console.error('Scene, Renderer, or Camera is not initialized yet!');
            return;
        }
        let points: THREE.Vector3[] = [];
        console.log('nodeIds--------------- ',nodeIds);
        const selectedPoints = calculateSelectedPoints(nodeIds);
        console.log('selectedPoints', selectedPoints);
        points = processSelectedPoints(selectedPoints);
        console.log('points', points);

        drawPoints(points);
        // //pushElement(nodeIds);
        saveElementData(nodeIds);
    };

    async function saveNodes () {

        const sendData = nodes.map((node: Node) => ({
            //id: node.id,
            name: node.name,
            x: node.coordinateX,
            y: node.coordinateY,
            z: node.coordinateZ,
            projectId: id_num,
        }));

        try{
            const response = await fetch('/api/nodes', {
                method: "PUT",
                body: JSON.stringify(sendData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if(!response.ok){
                throw new Error(`HTTP error!`);
            }

        } catch (error){
            console.log(error);
        }
    }

    async function saveElements () {
        const sendData = elements.map((element: Element) => ({
            name: element.name,
            projectId: id_num,
            nodeIds: element.nodeIds.map((id: number): number => id + nodes.length + 1)
        }));

        console.log('sendData', sendData);
        try{
            const response = await fetch('/api/elements', {
                method: "POST",
                body: JSON.stringify(sendData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(response);
            const json = await response.json();
            console.log('json ', json);
            if(!response.ok){
                throw new Error(`HTTP error!`);
            }
        }catch(error){
            console.log(error);
        }
    }

    const saveData = async () => {
        console.log('nodes : ', nodes);
        await saveNodes();
        await saveElements();
    }

    const handleExcute = async () => {
        try{
            setIsExcuting(true);
            setIsCompleted(false);
            const response = await fetch('/api/excute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodeCount: nodes.length,
                    elementCount: elements.length
                })
            });
            const data = await response.json();
            setResult(data);
            setIsCompleted(true); 
        } catch(error){
            console.error('Error', error);
        } finally {
            setIsExcuting(false);
        }
    };

    const handleNodeUpdate = (nodeId: number, value: number[]) => {
        setNodes(prev =>
            prev.map(node => 
                node.id == nodeId ? {...node, coordinateX: value[0], coordinateY: value[1], coordinateZ: value[2]} : node
            )
        );
    };

    return (
        <div className='w-full h-scree relative flex'>
            <div className='fixed top-40 left-4 space-x-2'>
                <button 
                  className='px-4 py-2 bg-blue-500  text-white rounded'
                  onClick={() => setNodeModalIsOpen(true)}
                >
                  Create Nodes
                </button>
                <button 
                  className='px-4 py-2 bg-green-500 text-white rounded'
                  onClick={() => setElementModalIsOpen(true)}
                >
                  Create Elements
                </button>
                <button 
                  className='px-4 py-2 bg-red-500 text-white rounded'
                  onClick={() => saveData()}
                >
                  Save
                </button>
                <button 
                  className='px-4 py-2 bg-black text-white rounded'
                  onClick={async () => {
                    handleExcute();
                    setResultModalIsOpen(true);
                  }}
                >
                  Excute
                </button>  
            </div>
            <div ref={mountRef} className='w-5/6 h-scree'>
                {/* THREE.JS Rendering code*/}
            </div>
            <div className='w-1/6 bg-slate-100 bg-opacity-50 h-screen'>
                <Sidebar
                    className='bg-gray-100 p-4'
                    nodes={nodes}
                    elements={elements}
                    onNodeUpdate={handleNodeUpdate}
                />
            </div>            
            <NodeDialog
              title="Create Node"
              isOpen={nodeModalIsOpen}
              onClickOK={handleNodeOK}
              onClickCancel={handleNodeCancel}
            />
            <ElementDialog
              title="Create Element"
              isOpen={elementModalIsOpen}
              nodes={nodes}
              onClickOK={(nodesIds)=>handleElementOK(nodesIds)}
              onClickCancel={handleElementCancel}
            />
            <ResultModal
                isOpen={resultModalIsOpen}
                isExecuting={isExcuting}
                isCompleted={isCompleted}
                result={result}
                onClickCancel={handleResultCancel}
            />
        </div>
    );
}