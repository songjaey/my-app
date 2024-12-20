import { Element, Node } from "@/interfaces";
import { useEffect, useState } from "react";

interface Props {
    className: string;
    nodes: Node[];
    elements: Element[];
    onNodeUpdate: (nodeId: number, value: number[]) => void;
}

export default function Sidebar({className, nodes, elements, onNodeUpdate} : Props) {
    useEffect(() => {
        console.log('Sidebar rendered with elements:', elements);
    }, [elements]);
    const [coordinates, setCoordinates] = useState<{ [key: number]: number[] }>({});
    //console.log('nodes sidebar ', nodes);

    return (
        <div className={className}>
            <div>
                <h2>Stats</h2>
                <div>Total Nodes : {nodes.length}</div>
                <div>Total Elements : {elements.length}</div>
            </div>
            <br></br>
            <div>
                <label>Nodes List</label>
                {nodes?.map((node : Node) => {
                    return(
                        <div key={node.id} className="p-4 border rounded mb-2">
                            <p>{node.name}</p>
                            <input 
                                value={coordinates[node.id]?.[0] ?? node.coordinateX}
                                onChange={(e) => {
                                    setCoordinates(prev => ({
                                        ...prev,
                                        [node.id]: [parseInt(e.target.value), node.coordinateY, node.coordinateZ]
                                    }));
                                }}
                                type="number"
                                className="border p-1"
                            />
                            <input 
                                value={coordinates[node.id]?.[1] ?? node.coordinateY}
                                onChange={(e) => {
                                    setCoordinates(prev => ({
                                        ...prev,
                                        [node.id]: [node.coordinateX, parseInt(e.target.value), node.coordinateZ]
                                    }));
                                }}
                                type="number"
                                className="border p-1"
                            />
                            <input 
                                value={coordinates[node.id]?.[2] ?? node.coordinateZ}
                                onChange={(e) => {
                                    setCoordinates(prev => ({
                                        ...prev,
                                        [node.id]: [node.coordinateX, node.coordinateY, parseInt(e.target.value)]
                                    }));
                                }}
                                type="number"
                                className="border p-1"
                            />
                            <button
                                onClick={() => onNodeUpdate(node.id, coordinates)}
                            >
                                edit
                            </button>
                        </div>
                    );
                })}
            </div>
            <div>
                <label>Elements List</label>
                {elements?.map((element) => {
                    return(
                        <div key={element.id} className="p-4 border rounded mb-2">
                            <p>{element.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}