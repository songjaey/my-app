import { useState } from "react";
import { NodeTree, ElementTree } from '@/interfaces'

interface Props {
    title: string;
    isOpen: boolean;
    nodes: NodeTree;
    onClickOK: (nodesIds: number[]) => void;
    onClickCancel: () => void;
}

function ElementDialog({title, isOpen, nodes, onClickOK, onClickCancel}: Props) {

    if(!isOpen) return null;
    //console.log('nodes:', nodes);
    const [selectedNodes, setSelectedNodes] = useState<number[]>([]);

    const handleSubmit = () => {
        onClickOK(selectedNodes);
        setSelectedNodes([]);
    }

    const handleClickDiv = (nodeId: number) => {
        if(selectedNodes.length > 3) return;
        if(!selectedNodes.includes(nodeId)){
            setSelectedNodes([...selectedNodes, nodeId]);
        }
    }

    const handleClickSelectedDiv = (nodeId: number) => {
        setSelectedNodes(selectedNodes.filter(id => id !== nodeId))
    }
    console.log(nodes);

    return (
        <div className="dialog-container absolute top-36 left-5 border border-black">
            <div className="dialog">
                <h2 className="text">{title}</h2>
                <p>Position</p>
                <div className="py-2 flex flex-row space-x-10">
                    <div>
                        <label>Node List</label>
                        {nodes.trees.map((node) => {
                            return (
                                <div key={node.nodeId} className="p-4 border rounded mb-2" onClick={() => handleClickDiv(node.nodeId)}>
                                    <p>{node.nodeName}</p>
                                    <p>{node.coordinateX},{node.coordinateY},{node.coordinateZ}</p>
                                </div>
                          );
                        })}
                    </div>
                    <div>
                        <label>Selected Nodes</label>
                        {nodes.trees.map((node) => {
                            return (
                                selectedNodes.includes(node.nodeId) ? (
                                    <div key={node.nodeId} className="p-4 border rounded mb-2" onClick={() => handleClickSelectedDiv(node.nodeId)}>
                                        <p>{node.nodeName}</p>
                                        <p>{node.coordinateX},{node.coordinateY},{node.coordinateZ}</p>
                                    </div>
                                ): null
                            );
                        })}
                    </div>
                </div>

                <div className="buttons py-2 flex justify-between">
                    <button onClick={onClickCancel}>cancel</button>
                    <button onClick={handleSubmit}>generate</button>
                </div>
            </div>
        </div>
    );
};

export default ElementDialog;