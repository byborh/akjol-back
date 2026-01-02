import { NodeAbstract } from "@modules/nodes/entity/Node.abstract";

export interface INodeRepository {
    getAllNodes(): Promise<Array<NodeAbstract> | null>;
    findNodeBySlug(slug: string): Promise<NodeAbstract | null>;
    findNodeById(nodeId: string): Promise<NodeAbstract | null>;
    findNextNodesById(id: string): Promise<Array<NodeAbstract> | null>;
    findPreviousNodesById(id: string): Promise<Array<NodeAbstract> | null>;
    createNode(node: NodeAbstract): Promise<NodeAbstract | null>;
    modifyNode(node: NodeAbstract): Promise<NodeAbstract | null>;
    deleteNode(nodeId: string): Promise<boolean>;
}