import { Element, Node } from "@/interfaces";
import { useEffect } from "react";

interface Props {
    className: string;
    nodes: Node[];
    elements: Element[];
}

export default function Sidebar({className, nodes, elements} : Props) {
    useEffect(() => {
        console.log('Sidebar rendered with elements:', elements);
    }, [elements]);
    return (
        <div className={className}>
            <div>
                <label>Nodes List</label>
                {nodes?.map((node : Node) => {
                    return(
                        <div key={node.id} className="p-4 border rounded mb-2">
                            <p>{node.name}</p>
                            <p>{node.coordinateX},{node.coordinateY},{node.coordinateZ}</p>
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