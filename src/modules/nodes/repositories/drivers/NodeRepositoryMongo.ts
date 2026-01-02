import { NodeMongoEntity } from "@modules/nodes/entity/mongo/Node.entity";
import { INodeRepository } from "../contract/INodeRepository";
import { Repository } from "typeorm";
import { IDatabase } from "@db/contract/IDatabase";
import { MongoDatabase } from "@db/drivers/mongo.datasource";
import { NodeAbstract } from "@modules/nodes/entity/Node.abstract";

export class NodeRepositoryMongo implements INodeRepository {
    private repository: Repository<NodeMongoEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as MongoDatabase;
        this.repository = dataSource.getDataSource().getRepository(NodeMongoEntity);
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

}