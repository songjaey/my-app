'use client';
import { useEffect, useRef, useState } from 'react';
import { NodeTree, NodeTreeType ,ElementTree } from '@/interfaces'
import { NodeTreeData, Project } from '@prisma/client';
import { ElementTreeData } from "@prisma/client";
import * as THREE from 'three';
import NodeDialog from '@/app/components/node-dialog';
import ElementDialog from '@/app/components/element-dialog';
import Sidebar from '@/app/components/sidebar';
import { useSearchParams } from 'next/navigation';

interface WorkspaceProps {
    projectId?: number;
}
interface APINodeData {
    id: number;
    name: string;
    coordinateX: number;
    coordinateY: number;
    coordinateZ: number;
}

export default function Workspace() {
    const searchParams = useSearchParams();
    const id = Number(searchParams.get('id')); 


    const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
    const [saveElements, setSaveElements] = useState<ElementTree[]>([]);
    const [nodes, setNodes] = useState<NodeTree>({trees: [] });
    const [allNodes, setAllNodes] = useState<NodeTree>({trees: [] });
    //const [nodeIdsStart, setNodeIdsStart] = useState<number>();
    const mountRef = useRef<HTMLDivElement>(null);
    const [nextId, setNextId] = useState(0);
    const [nodeId, setNodeId] = useState(0);
    const [enextId, setEnextId] = useState(0);
    const [nodeModalIsOpen, setNodeModalIsOpen] = useState(false);
    const [elementModalIsOpen, setElementModalIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.Camera | null>(null);
    const linesRef = useRef<THREE.Line[]>([]);
    const [nodeDataIdx, setNodeDataIdx] = useState<number[]>([]); 
    const elements: ElementTree[] = [];
    let saveElementIds: number[] = [];
    const [totalNodeNumber, setTotalNodeNumber] = useState(0);

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
        const readProjectData = async () => {
            try {
                const res = await fetch('../../api/project');
                const projectData = await res.json();
                
                console.log('savedNodeIds' ,projectData.data[id - 1].savedNodeIds);

                if (projectData.data && Array.isArray(projectData.data)) {
                    // 배열의 첫 번째 요소의 savedNodeIds 사용
                    if (projectData.data[id-1]?.savedNodeIds) {
                        const nodeIds = projectData.data[id-1].savedNodeIds
                            .split(',')
                            .map(Number);
                        setNodeDataIdx(nodeIds);
                        //console.log('SavedNodeIds:', nodeIds);
                    }
                }                
            } catch (error) {
                console.error('Error fetching project datareadProjectData:', error);
            }
        }
        readProjectData();
    }, []);

    useEffect(() => {
        const searchData = async () => {
            console.log('idx', nodeDataIdx);
            if(nodeDataIdx.length > 0){
                try {
                    const res = await fetch('../../api/searchNodes', {
                        method: 'POST',
                        body: JSON.stringify({ id: nodeDataIdx }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const nodeDataArray = await res.json();
                    console.log('nodeDataArray', nodeDataArray);
                    
                    if (nodeDataArray.data && Array.isArray(nodeDataArray.data)) {
                        console.log('nodeDataArray', nodeDataArray);
                        setNodes((prev) => ({
                            trees: [
                                ...prev.trees,
                                ...nodeDataArray.data.map((nodeData: NodeTreeData) => ({
                                    nodeId: nodeData.id-1,
                                    nodeName: nodeData.name,
                                    coordinateX: nodeData.coordinateX,
                                    coordinateY: nodeData.coordinateY,
                                    coordinateZ: nodeData.coordinateZ
                                }))
                            ]
                        }));
                        console.log('nodes', nodes);
                    }
                } catch (error) {
                    console.error('Error in searchNodeDatas:', error);
                }
            }         
        }
        searchData();
    }, [nodeDataIdx]);

    // useEffect(() => {
    //     const readNodesData = async () => {
    //         try {
    //             if (nodeDataIdx.length > 0) {
    //                 console.log('nodeDataIdx',nodeDataIdx);
    //                 const res = await fetch('../../api/searchNodes', {
    //                     method: 'POST',
    //                     body: JSON.stringify({ id: nodeDataIdx }),
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     }
    //                 });
    //                 const nodeDataArray = await res.json();
                    
    //                 if (nodeDataArray.data && Array.isArray(nodeDataArray.data)) {
    //                     setNodes((prev) => ({
    //                         trees: [
    //                             ...prev.trees,
    //                             ...nodeDataArray.data.map((nodeData: NodeTreeData) => ({
    //                                 nodeId: nodeData.id-1,
    //                                 nodeName: nodeData.name,
    //                                 coordinateX: nodeData.coordinateX,
    //                                 coordinateY: nodeData.coordinateY,
    //                                 coordinateZ: nodeData.coordinateZ
    //                             }))
    //                         ]
    //                     }));
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error fetching nodeIdsData:', error);
    //         }
    //     };
    //     readNodesData();
    // }, [nodeDataIdx]);

    // useEffect(() => {
    //     const readElementsData = async () => {
    //         try {
    //             const res = await fetch('../../api/elementsData');
    //             const elementsDataArray = await res.json();
                
    //             const newElements = elementsDataArray.data.map((elementData: ElementTreeData) => ({
    //                 elementId: elementData.id,
    //                 elementName: elementData.name,
    //                 elementNodeId: elementData.savedNodeIds.split(',').map(Number),
    //             }));
    //             setSaveElements(newElements);  
    //             console.log('Mapped Elements:', newElements); 
    //         } catch (error) {
    //             console.error('Error fetching nodeIdsData:', error);
    //         }
    //     };
    //     readElementsData();
    // }, []);

    const handleNodeOK = (X: number, Y: number, Z: number) => {
        // console.log('nextId : ', nextId);
        console.log('totalNodeNumber : ', totalNodeNumber);
        //setNodeId(nodes.trees.length + 2);
        addTotalNodeNumber();
        addNode(X,Y,Z);
        handleCreateNodes({
            name: 'node' + String(totalNodeNumber),
            coordinateX: X,
            coordinateY: Y,
            coordinateZ: Z
        });

        setAllNodes((prev) => ({
            trees: [
                ...prev.trees,
                {   
                    nodeId: totalNodeNumber + 1, //문제있나?
                    nodeName: 'node' + String(totalNodeNumber),
                    coordinateX: X,
                    coordinateY: Y,
                    coordinateZ: Z
                }
            ]
        }));
        addNextId();
    };
    function addTotalNodeNumber(){
        setTotalNodeNumber(totalNodeNumber+1);
    }
    function addNode(X: number, Y:number, Z:number){
        setNodes((prev) => ({
            trees: [
                ...prev.trees,
                {
                    nodeId: totalNodeNumber,
                    nodeName: 'node' + String(totalNodeNumber),
                    coordinateX: X,
                    coordinateY: Y,
                    coordinateZ: Z      
                }
            ] 
        }));
    }
    function addNextId(){
        setNextId(nextId + 1);
    }
    useEffect(() => {
        let count = 0;
        const getNodesData = async () => {
            const response = await fetch('../../api/nodeDatas');
            const nodeData = await response.json();
            
            if (nodeData.data && Array.isArray(nodeData.data)) {
                let newNodes: NodeTree = { trees: [] };
                nodeData.data.forEach((node: NodeTreeType) => {
                    newNodes.trees.push({
                        nodeId: node.id,
                        nodeName: node.name,
                        coordinateX: node.coordinateX,
                        coordinateY: node.coordinateY,
                        coordinateZ: node.coordinateZ
                    });
                });
                //console.log('newNodes', newNodes);
                getAllNodes(newNodes);
                //setAllNodes(newNodes);
            }
            // console.log('nodes', nodes);
            // console.log('allNodes', allNodes);   
        };
        getNodesData();
        console.log('allNodes', allNodes); 
    },[]);

    function getAllNodes(getNodes: NodeTree){
        //console.log('allNodes', getNodes);
        setAllNodes(getNodes);
        //console.log('first allNodes', allNodes);
    }

    useEffect(() => {
        const getNodesCount = async () => {
            const response = await (await fetch('../../api/getTotalIdx'));
            const nodeData = await response.json();
            //console.log(nodeData.totalCount);
            setTotalNodeNumber(nodeData.totalCount);
        }
        getNodesCount();
    }, []);

    const handleCreateNodes = async ( data: Omit<NodeTreeData, 'id'> ) => {
        const sendData = { ...data };
        const response = await (await fetch('../../api/nodeDatas', {
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

    const handleCreateElement = async ( data: Omit<ElementTreeData, 'id'> ) => {
        const sendData = { ...data };
        const response = await (await fetch('../../api/elementsData', {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: {
                "Content-Type": "application/json",
            },
        })).json();
    }

    const handleUpdateProject = async ( data: Omit<Project, 'createdAt' | 'title' | 'isSaved' | 'imageSrc'> ) => {
        const sendData = { ...data };
        const response = (await fetch('../../api/project', {
            method:"PUT",
            body: JSON.stringify(sendData),
            headers: {
                "Content-Type": "application/json",
            },
        }));
        console.log(response);
    }

    // // 클라이언트: Elements 업데이트 함수
    // const handleUpdateProjectElements = async (projectId: number, elementIds: string) => {
    //     const sendData = {
    //         id: projectId,
    //         savedElementIds: elementIds,
    //         type: 'elements'  // 타입 구분을 위해 추가
    //     };
        
    //     const response = await fetch('../../api/project', {
    //         method: "PUT",
    //         body: JSON.stringify(sendData),
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });
        
    //     return response.json();
    // };

    // // 클라이언트: Nodes 업데이트 함수
    // const handleUpdateProjectNodes = async (projectId: number, nodeIds: string) => {
    //     try {
    //         const sendData = {
    //             id: projectId,
    //             savedNodeIds: nodeIds
    //         };
            
    //         const response = await fetch('../../api/project', {
    //             method: "PUT",
    //             body: JSON.stringify(sendData),
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });
    
    //         // 응답 상태 확인
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    
    //         // 응답 본문이 있는지 확인
    //         const contentType = response.headers.get("content-type");
    //         if (contentType && contentType.includes("application/json")) {
    //             return await response.json();
    //         } else {
    //             // JSON이 아니거나 빈 응답인 경우
    //             return { success: true };
    //         }
    //     } catch (error) {
    //         console.error("Error in handleUpdateProjectNodes:", error);
    //         throw error;
    //     }
    // };

    const handleNodeCancel = () => {
        setNodeModalIsOpen(false);
    };

    function calculateSelectedPoints (nodeIds: number[], iter: number) {
        const selectedPointsTemp: number[] = [];
        for(let i = 0; i < iter; i++) {
            selectedPointsTemp[i] = allNodes.trees[nodeIds[i]-1].nodeId + 1;
        }
        return selectedPointsTemp;
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

    // useEffect(() => {
    //     if (selectedNodes.length > 0) {
    //         console.log('selectedNodes updated:', selectedNodes);
    //     }
    // }, [selectedNodes]);
    
    // function processAndDrawPoints (nodeIds: number[]) {
    //     //const points = processSelectedPoints();
    //     //console.log('points',points);
    //     drawPoints(points);
    //     pushElement(nodeIds);
    // };
    
    function updateProjectData(nodeIds: number[]) {
        handleUpdateProject({
            id: id,
            savedNodeIds: String(nodeIds),
            savedElementIds: "",
        });
    };
    
    const processNodeIds = (nodeIds: number[], iter: number) => {
        const nodeIdsData = nodeIds.map((id) => (id + iter + 1));
        console.log('nodeIds', nodeIdsData);
        console.log('stringTemp', nodeIdsData);
        return nodeIdsData;
    };
    
    const createNewElement = () => {
        handleCreateElement({
            name: 'element' + String(saveElements.length),
            savedNodeIds: String(selectedNodes),
        });
    };
    
    const updateElementIds = () => {
        saveElementIds = saveElements.map((element) => element.elementId);
    };

    //여기가 문제
    const handleElementOK = async (nodeIds: number[]) => {
        //console.log(nodeIds);
        if (!isInitialized) {
            console.error('Scene, Renderer, or Camera is not initialized yet!');
            return;
        }

        const iter = nodeIds.length;
        let points: THREE.Vector3[] = [];
        // const selectedPointsTemp: number[] = [];
        
        // for(let i = 0; i < iter; i++) {
        //     selectedPointsTemp[i] = allNodes.trees[nodeIds[i]-1].nodeId + 1;
        // }
        // //console.log(selectedPointsTemp);

        // await new Promise<void>(resolve => {
        //     setSelectedNodes(prev => {
        //         const newState = [...prev, ...selectedPointsTemp];
        //         resolve();
        //         return newState;
        //     });
        // });
        // console.log('selectedNodes',selectedNodes);
        // //const selectedPointsTemp = selectedPoints.map((selectedPoint) => selectedPoint); 

        // const points = processSelectedPoints();
        // drawPoints(points);
        // pushElement(nodeIds);
       
        // //console.log('selectedPointsTemp',selectedPointsTemp)
        
        // //await handleUpdateProjectNodes(projectId, String(selectedPoints));
        // //handleUpdateProjectElements(projectId, String(saveElementIds));
        // await handleUpdateProject({
        //     id: projectId,
        //     savedNodeIds: String(selectedNodes),
        //     savedElementIds: "",
        // });
        // const nodeIdsTemp: number[] = [...nodeIds];
        // const nodeIdsData = nodeIds.map((id) => (id + iter + 1));
        // console.log('nodeIds', nodeIdsData);
        // console.log('stringTemp', nodeIdsData);

        // await handleCreateElement({
        //     name: 'element' + String(saveElements.length),
        //     savedNodeIds: String(selectedNodes),
        // });
        // saveElementIds = saveElements.map((element) => element.elementId); //TODO: Read한 것만 읽어오도록 수정
        //await handleUpdateProjectElements(projectId, String(saveElementIds));

        const selectedPointsTemp = calculateSelectedPoints(nodeIds, iter);
        console.log('selectedPointsTemp', selectedPointsTemp);
        const updatedNodes = await updateNodes(selectedPointsTemp);
        console.log('selectedNodes', updatedNodes);
        points = processSelectedPoints(selectedPointsTemp);
        console.log('points', points);
        //processAndDrawPoints(nodeIds);
        drawPoints(points);
        //pushElement(nodeIds);
        saveElementData(nodeIds);
        nextElementId();

        updateProjectData(nodeIds);
        // const nodeIdsData = processNodeIds(nodeIds, iter);
        createNewElement();
        updateElementIds();
    };

    const handleElementCancel = () => {
        setElementModalIsOpen(false);
    };

    function processSelectedPoints(updatedSelectedNodes: number[]) {
        const points: THREE.Vector3[] = [];
        console.log('---------------');
        console.log('updatedSelectedNodes',updatedSelectedNodes);
        updatedSelectedNodes.forEach((pointIndex) => {
            console.log('processing index:', pointIndex - 1); // 실제 접근하려는 인덱스
            console.log('trees length:', allNodes.trees.length); // 배열 길이 확인

            const node = allNodes.trees[pointIndex - 1];
            console.log('node data',node);
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

    // function pushElement(selectedPoints: number[]){
    //     // const newElement: ElementTree = {
    //     //     elementId: enextId,
    //     //     elementName: 'element' + String(enextId),
    //     //     elementNodeId: selectedPoints
    //     // };
    //     // elements.push(newElement);
    //     saveElementData();
    //     nextElementId();
    // }
    function saveElementData(selectedPoints: number[]) {
        console.log(selectedPoints);
        setSaveElements(prev => [...prev, {
            elementId: enextId,
            elementName: 'element' + String(enextId),
            elementNodeId: selectedPoints
        }]);
    }

    function nextElementId() {
        setEnextId(enextId + 1);
    }

    return(
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
                    elements={saveElements}
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
