import { INodeRepository } from "../contract/INodeRepository";
import { IDatabase } from "@db/contract/IDatabase";
import { RedisClientType } from "redis";
import { NodeRedisEntity } from "@modules/nodes/entity/redis/Node.entity";

export class NodeRepositoryRedis implements INodeRepository {
    private client: RedisClientType;
    private isInitialized: Promise<void>; // Be sure to wait for initialization
    
    constructor(private db: IDatabase) {
        this.client = db.getDataSource() as RedisClientType;
        this.isInitialized = this.initialized();
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

    async findNodeByField(field: string, value: string): Promise<NodeRedisEntity | null> {
        return null; // Don't use this method
    }

    async findNodeById(nodeId: string): Promise<NodeRedisEntity | null> {
        try {
            await this.isInitialized; // Wait for initialization

            const nodeData = await this.client.hGetAll(`node:${nodeId}`);

            return Object.keys(nodeData).length > 0 ? NodeRedisEntity.fromRedisHash(nodeData) : null;
        } catch (error) {
            console.error("Failed to find node by field:", error);
            throw error;
        }
    }

    async findNodeByEmail(email: string): Promise<NodeRedisEntity | null> {
        try {
            await this.isInitialized; // Wait for initialization

            const nodeId = await this.client.hGet(`node_index`, `email:${email}`);
            if(!nodeId) return null;

            const nodeData = await this.client.hGetAll(`node:${nodeId}`);
            return Object.keys(nodeData).length > 0 ? NodeRedisEntity.fromRedisHash(nodeData) : null;
        } catch (error) {
            console.error("Failed to find node by email:", error);
            throw error;
        }
    }

    async getAllNodes(): Promise<NodeRedisEntity[]> {
        try {
            await this.isInitialized; // Wait for initialization
            const nodes: NodeRedisEntity[] = [];
            let cursor: number = 0;

            do {
                const reply = await this.client.scan(cursor, { MATCH: "node:*", COUNT: 100});
                cursor = reply.cursor;
                const keys = reply.keys;

                for(const key of keys) {
                    const nodeData = await this.client.hGetAll(key);
                    nodes.push(NodeRedisEntity.fromRedisHash(nodeData))
                }
        
            } while(cursor !== 0);
    
            return nodes;
        } catch (error) {
            console.error("Failed to find all nodes:", error);
            throw error;
        }
    }

    async createNode(node: NodeRedisEntity): Promise<NodeRedisEntity | null> {
        try {
            await this.isInitialized; // Wait for initialization

            await this.client.hSet(`node:${node.id}`, node.toRedisHash());

            // Create an index in email
            await this.client.hSet(`node_index`, `email:${node.email}`, node.id);

            // Verify if node was created
            const exists = await this.client.exists(`node:${node.id}`);
            
            return exists === 1 ? node : null;
        } catch (error) {
            console.error("Failed to create node:", error);
            throw error;
        }
    }

    async modifyNode(node: NodeRedisEntity): Promise<NodeRedisEntity | null> {
        try {
            await this.isInitialized; // Wait for initialization

            await this.client.hSet(`node:${node.id}`, node.toRedisHash());

            // Update the index in email
            await this.client.hDel("node_index", `email:${node.email}`);
            await this.client.hSet(`node_index`, `email:${node.email}`, node.id);

            const exists = await this.client.exists(`node:${node.id}`);
            
            return exists === 1 ? node : null;
        } catch (error) {
            console.error("Failed to modify node:", error);
            throw error;
        }
    }

    async deleteNode(nodeId: string): Promise<boolean> {
        try {
            await this.isInitialized; // Wait for initialization

            // stock email of node in constant
            const email = await this.client.hGet(`node:${nodeId}`, "email");

            // Delete the Node
            const nodeDel = await this.client.del(`node:${nodeId}`);

            // Delete node roles of node
            const nodeRolesDel = await this.client.del(`node_roles:${nodeId}`);

            // Delete node index
            const nodeIndexDel = await this.client.hDel("node_index", `email:${email}`);

            return nodeDel > 0 || nodeRolesDel > 0 || nodeIndexDel > 0;
        } catch (error) {
            console.error("Failed to delete node:", error);
            throw error;
        }
    }
}