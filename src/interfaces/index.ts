export interface NodeTree {
    trees: {
        nodeId: number;
        nodeName: string;
        coordinateX: number;
        coordinateY: number;
        coordinateZ: number;
    }[];
}

export interface Node {
    id: number;
    name: string;
    coordinateX: number;
    coordinateY: number;
    coordinateZ: number;
    projectId: number;
}

export interface Element {
    id: number;
    name: string;
    projectId: number;
    nodeIds: number[];
}

export interface Result {
    nodeCount: number;
    elementCount: number;
}