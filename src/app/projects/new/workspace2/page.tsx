'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSearchParams } from 'next/navigation';
import { NodeTreeData } from '@prisma/client';
import NodeDialog from '@/app/components/node-dialog';
import ElementDialog from '@/app/components/element-dialog';
import Sidebar from '@/app/components/sidebar';
import { Element, Node } from '@/interfaces';
import { Project } from '@prisma/client';

export default function Workspace(){

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const id_num = Number(id);
    console.log('id_num :',id_num);

    const [isInitialized, setIsInitialized] = useState(false);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.Camera | null>(null);
    const linesRef = useRef<THREE.Line[]>([]);

    const [nodeModalIsOpen, setNodeModalIsOpen] = useState(false);
    const [elementModalIsOpen, setElementModalIsOpen] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [elements, setElements] = useState<Element[]>([]);

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
            const nodeDataArray = await res.json();
            if (nodeDataArray.data && Array.isArray(nodeDataArray.data)) {
                console.log('nodeDataArray', nodeDataArray);
                const mappedNodes = nodeDataArray.map((nodeData: NodeTreeData) => ({
                    id: nodeData.id - 1,
                    name: nodeData.name,
                    coordinateX: nodeData.coordinateX,
                    coordinateY: nodeData.coordinateY,
                    coordinateZ: nodeData.coordinateZ,
                }));
                setNodes((prev) => ({
                    ...prev,
                    ...mappedNodes.data.map((node: NodeTreeData) => ({
                        id: nodes.length,
                        name: node.name,
                        coordinateX: node.coordinateX,
                        coordinateY: node.coordinateY,
                        coordinateZ: node.coordinateZ,
                        projectId: id_num
                    }))
                }));
                console.log('nodes', nodes);
            }
        }
        searchData();
    }, []);

    const handleCreateNodes = async (nodesData: Node[]) => {
        const sendData = nodesData.map((node: Node) => ({
            name: node.name,
            coordinateX: node.coordinateX,
            coordinateY: node.coordinateY,
            coordinateZ: node.coordinateZ,
            projectId: id_num
        }));
        console.log('sendData', sendData);
        // const response = await fetch('../../api/nodeDatas', {
        //     method: "POST",
        //     body: JSON.stringify(sendData),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // });

        try{
            const response = await fetch('/api/nodeDatas', {
                method: "POST",
                body: JSON.stringify(sendData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response);
        } catch(error) {
            console.log('error', error);
        }
        // if(response.errors) {
        //     console.log(response.errors);
        //     return;
        // }
    }

    const handleNodeOK = (X: number, Y: number, Z: number) => {
        setNodes(prev => {
            const newNodes = [...prev, {
                id: prev.length,
                name: 'node' + String(prev.length),
                coordinateX: X,
                coordinateY: Y,
                coordinateZ: Z,
                projectId: id_num
            }];
            //handleCreateNodes(newNodes);
            return newNodes;
        });
        //handleCreateNodes(nodes);
    };

    const handleNodeCancel = () => {
        setNodeModalIsOpen(false);
    }

    const handleElementCancel = () => {
        setElementModalIsOpen(false);
    }

    function calculateSelectedPoints (nodeIds: number[]) {
        const selectedPoints: number[] = [];
        console.log('nodeIds', nodeIds);
        for(let i = 0; i < nodeIds.length; i++) {
            //selectedPoints[i] = allNodes.trees[nodeIds[i]-1].nodeId + 1;
            selectedPoints[i] = nodes[nodeIds[i]].id;
        }
        console.log('selectedPoints', selectedPoints);
        return selectedPoints;
    };
    
    async function updateNodes(selectedPointsTemp: number[]) {
        return new Promise<number[]>((resolve) => {
            setSelectedNodes(prev => {
                const newState = [...prev, ...selectedPointsTemp];
                resolve(newState); 
                return newState;
            });
        });
    }

    function processSelectedPoints(SelectedNodes: number[]) {
        const points: THREE.Vector3[] = [];
        console.log('updatedSelectedNodes',SelectedNodes);
        SelectedNodes.forEach((pointIndex) => {
            console.log('processing index:', pointIndex - 1); 
            //console.log('trees length:', allNodes.trees.length); 
            const node = nodes[pointIndex];
            //console.log('node data',node);
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
            nodes: selectedNodes.map(nodeIndex => nodes[nodeIndex]),
        }]);
        // setNodes(prevNodes => 
        //     prevNodes.map(node => 
        //         selectedNodes.includes(node.id)?
        //                 {...node, elementId: elementId} : node
        //     )
        // );
    }

    function updateProjectData(nodeIds: number[]) {
        // handleUpdateProject({
        //     id: Number(id_num),
        //     nodes: 
        // });
    };

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
        //console.log(nodeIds);
        if (!isInitialized) {
            console.error('Scene, Renderer, or Camera is not initialized yet!');
            return;
        }
        //const iter = nodeIds.length;
        let points: THREE.Vector3[] = [];
        const selectedPoints = calculateSelectedPoints(nodeIds);
        console.log('selectedPoints', selectedPoints);
        // const updatedNodes = await updateNodes(selectedPointsTemp);
        // console.log('selectedNodes', updatedNodes);
        points = processSelectedPoints(selectedPoints);
        console.log('points', points);
        // //processAndDrawPoints(nodeIds);

        drawPoints(points);
        // //pushElement(nodeIds);
        saveElementData(nodeIds);

        //updateProjectData(nodeIds);  // DB에 변수 데이터 저장

        // // const nodeIdsData = processNodeIds(nodeIds, iter);
        // createNewElement();
        // updateElementIds();
    };

    async function saveNodes () {
        const sendData = nodes.map((node: Node) => ({
            name: node.name,
            coordinateX: node.coordinateX,
            coordinateY: node.coordinateY,
            coordinateZ: node.coordinateZ,
            projectId: id_num,
        }));
        try{
            const response = await fetch('../../api/nodeDatas', {
                method: "POST",
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
            nodes: element.nodes
        }));

        try{
            const response = await fetch('../../api/elementsData', {
                method: "POST",
                body: JSON.stringify(sendData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if(!response.ok){
                throw new Error(`HTTP error!`);
            }

        }catch(error){
            console.log(error);
        }
    }

    const saveData = async () => {
        console.log(elements);
        await saveNodes();
        await saveElements();
    }

    return (
        <div className='w-full h-scree relative flex'>
            <div className='fixed top-20 left-4 space-x-2'>
                <button 
                  className='px-4 py-2 bg-blue-500 text-white-rounded'
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
                {/* <button 
                  className='px-4 py-2 bg-red-300 text-white rounded'
                  onClick={() => setElementModalIsOpen(true)}
                >
                  Save
                </button> */}
            </div>
            <div ref={mountRef} className='w-5/6 h-scree'>
                {/* THREE.JS Rendering code*/}
            </div>
            <div className='w-1/6 bg-slate-100 bg-opacity-50 h-screen'>
                <Sidebar
                    className='bg-gray-100 p-4'
                    nodes={nodes}
                    elements={elements}
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
        </div>
    );
}