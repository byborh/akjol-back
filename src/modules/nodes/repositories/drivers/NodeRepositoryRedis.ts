import { INodeRepository } from "../contract/INodeRepository";
import { IDatabase } from "@db/contract/IDatabase";
import { RedisClientType } from "redis";
import { NodeRedisEntity } from "@modules/nodes/entity/redis/Node.entity";
import { NodeAbstract } from "@modules/nodes/entity/Node.abstract";

export class NodeRepositoryRedis implements INodeRepository {
    private client: RedisClientType;
    private isInitialized: Promise<void>; // Be sure to wait for initialization
    
    constructor(private db: IDatabase) {
        this.client = db.getDataSource() as RedisClientType;
        this.isInitialized = this.initialized();
    }
    getAllNodes(): Promise<Array<NodeAbstract> | null> {
        throw new Error("Method not implemented.");
    }
    findNodeBySlug(slug: string): Promise<NodeAbstract | null> {
        throw new Error("Method not implemented.");
    }
    findNodeById(nodeId: string): Promise<NodeAbstract | null> {
        throw new Error("Method not implemented.");
    }
    findNextNodesById(id: string): Promise<Array<NodeAbstract> | null> {
        throw new Error("Method not implemented.");
    }
    findPreviousNodesById(id: string): Promise<Array<NodeAbstract> | null> {
        throw new Error("Method not implemented.");
    }
    createNode(node: NodeAbstract): Promise<NodeAbstract | null> {
        throw new Error("Method not implemented.");
    }
    modifyNode(node: NodeAbstract): Promise<NodeAbstract | null> {
        throw new Error("Method not implemented.");
    }
    deleteNode(nodeId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    // Connect to database
    async initialized(): Promise<void> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }
    
}