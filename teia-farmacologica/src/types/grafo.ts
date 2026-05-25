
export interface NodeData {
    id: string;
    label: string;
    classeRisco: string;
}

export interface NodeDTO {
    data: NodeData;
}

export interface EdgeData {
    id: string;
    source: string;
    target: string;
    severidade: string;
    descricao: string;
    corLinha: string;
}

export interface EdgeDTO {
    data: EdgeData;
}

export interface GrafoDTO {
    nodes: NodeDTO[];
    edges: EdgeDTO[];
}