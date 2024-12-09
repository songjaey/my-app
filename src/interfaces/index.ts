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

export interface ElementTree {
    elementId: number;
    elementName: string;
    elementNodeId: number[];
}