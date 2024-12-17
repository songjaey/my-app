export interface NodeTree {
    trees: {
        nodeId: number;
        nodeName: string;
        coordinateX: number;
        coordinateY: number;
        coordinateZ: number;
    }[];
}

export interface NodeTreeType {
    id: number;
    name: string;
    coordinateX: number;
    coordinateY: number;
    coordinateZ: number;
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
    nodes: Node[];
}

export interface ElementTree {
    elementId: number;
    elementName: string;
    elementNodeId: number[];
}