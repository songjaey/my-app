import { ElementTree, NodeTree } from "@/interfaces";
import { useEffect } from "react";

interface Props {
    className: string;
    nodes: NodeTree;
    elements: ElementTree[];
}

export default function Sidebar({className, nodes, elements} : Props) {
    useEffect(() => {
        console.log('Sidebar rendered with elements:', elements);
    }, [elements]);
    return (
        <div className={className}>
            <div>
                <label>Nodes List</label>
                {nodes?.trees?.map((node) => {
                    return(
                        <div key={node.nodeId} className="p-4 border rounded mb-2">
                            <p>{node.nodeName}</p>
                            <p>{node.coordinateX},{node.coordinateY},{node.coordinateZ}</p>
                        </div>
                    );
                })}
            </div>
            <div>
                <label>Elements List</label>
                {elements?.map((element) => {
                    return(
                        <div key={element.elementId} className="p-4 border rounded mb-2">
                            <p>{element.elementName}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}