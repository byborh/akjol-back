import { NodeMongoEntity } from "@modules/nodes/entity/mongo/Node.entity";
import { INodeRepository } from "../contract/INodeRepository";
import { Repository } from "typeorm";
import { IDatabase } from "@db/contract/IDatabase";
import { MongoDatabase } from "@db/drivers/mongo.datasource";

export class NodeRepositoryMongo implements INodeRepository {
    private repository: Repository<NodeMongoEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as MongoDatabase;
        this.repository = dataSource.getDataSource().getRepository(NodeMongoEntity);
    }

    async findNodeByField(field: string, value: string): Promise<NodeMongoEntity | null> {
        // Validate field
        const allowedFields = ['id', 'email', 'first_name', 'last_name', 'pseudo', 'telnumber', 'createdAt', 'updatedAt'];
        if (!allowedFields.includes(field)) throw new Error(`Invalid field: ${field}`);

        // Find node by field
        const row = await this.repository.findOne({ where: { [field]: value } });

        // Validate row
        if (!row) return null;

        const node = Array.isArray(row) ? row[0] : row;

        // Verify if all required fields are present
        if (!node.id || !node.email || !node.password) {
            console.error("Invalid node data:", node);
            throw new Error("NodeMongoEntity data is incomplete.");
        }

        // Return the node
        return node || null;
    }

    async findNodeById(nodeId: string): Promise<NodeMongoEntity | null> {
        if (!nodeId) return null;
        return await this.findNodeByField('id', nodeId) || null;
    }

    async findNodeByEmail(email: string): Promise<NodeMongoEntity | null> {
        if (!email) return null;
        return await this.findNodeByField('email', email) || null;
    }

    async getNodeByMultipleFields(fields: string[], values: string[]): Promise<NodeMongoEntity | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        });

        // Find node
        return await this.repository.findOne({ where: conditions }) || null;
    }

    async getAllNodes(): Promise<NodeMongoEntity[]> {
        // Fetch all nodes from the database
        const rawResult: NodeMongoEntity[] = await this.repository.find();

        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];

        if (rowsArray.length === 0) return [];

        // Return the array of nodes
        return rowsArray;
    }

    async createNode(node: NodeMongoEntity): Promise<NodeMongoEntity | null> {
        // Insert the node in the database
        const result = await this.repository.save(node);

        // If the node is not created, return null
        if (!result) return null;

        // Return the node
        return this.findNodeById(node.getId()) || null;
    }

    async modifyNode(node: NodeMongoEntity): Promise<NodeMongoEntity | null> {
        // Be sure that node exists
        const existingNode: NodeMongoEntity | null = await this.repository.findOneBy({ id: node.getId() });
        if (!existingNode) return null;

        // Merge node data with existing node data
        this.repository.merge(existingNode, node);

        // Save the modified node
        const result = await this.repository.save(existingNode);

        // Return the node
        return this.findNodeById(node.getId()) || null;
    }

    async deleteNode(nodeId: string): Promise<boolean> {
        const result = await this.repository.delete(nodeId);

        // Return true if the node is deleted, false otherwise
        return !!result.affected; // `affected` indique le nombre de lignes supprimées
    }
}