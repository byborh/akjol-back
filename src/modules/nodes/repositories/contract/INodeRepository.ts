import { NodeAbstract } from "@modules/nodes/entity/Node.abstract";

export interface INodeRepository {
    findNodeByField(field: string, value: string): Promise<NodeAbstract | null>;
    findNodeById(nodeId: string): Promise<NodeAbstract | null>;
    findNodeByEmail(email: string): Promise<NodeAbstract | null>;
    getAllNodes(): Promise<Array<NodeAbstract> | null>;
    createNode(node: NodeAbstract): Promise<NodeAbstract | null>;
    modifyNode(node: NodeAbstract): Promise<NodeAbstract | null>;
    deleteNode(nodeId: string): Promise<boolean>;
}