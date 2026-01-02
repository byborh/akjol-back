import { NodeSQLEntity } from "@modules/nodes/entity/sql/Node.entity";
import { INodeRepository } from "../contract/INodeRepository";
import { Repository } from "typeorm";
import { IDatabase } from "@db/contract/IDatabase";
import { SQLDatabase } from "@db/drivers/sql.datasource";

export class NodeRepositorySQL implements INodeRepository {
    private repository: Repository<NodeSQLEntity>;

    constructor(private db: IDatabase) {
        const dataSource = db as SQLDatabase;
        this.repository = dataSource.getDataSource().getRepository(NodeSQLEntity);
    }

    async findNodeByField(field: string, value: string): Promise<NodeSQLEntity | null> {
        // Validate field
        const allowedFields = ['id', 'email', 'first_name', 'last_name', 'pseudo', 'tel_number', 'createdAt', 'updatedAt'];
        if(!allowedFields.includes(field)) throw new Error(`Invalid field: ${field}`);

        // List of nodes finded by field
        const row = await this.repository.findOne({where: {[field]: value}});

        // Validate rows
        if (!row) return null;

        const node = Array.isArray(row) ? row[0] : row

        // Verify if all required fields are present
        if (!node.id || !node.email || !node.password) {
            console.error("Invalid node data:", node);
            throw new Error("NodeSQLEntity data is incomplete.");
        }

        // Map the result to a NodeSQLEntity instance
        return node || null;
    }
    
    async findNodeById(nodeId: string): Promise<NodeSQLEntity | null> {
        if(!nodeId) return null;
        return await this.findNodeByField('id', nodeId) || null;
    }

    async findNodeByEmail(email: string): Promise<NodeSQLEntity | null> {
        if(!email) return null;
        return await this.findNodeByField('email', email) || null;
    }

    /**
     * Retrieves a node from the database based on multiple fields and their corresponding values.
     * This method is useful when you need to find a node using a combination of fields (e.g., email and nodename, or firstName and lastName).
     * 
     * @param fields - An array of field names (e.g., ['email', 'nodename']) to search by.
     * @param values - An array of values (e.g., ['test@example.com', 'john_doe']) corresponding to the fields.
     * 
     * @returns A Promise that resolves to the found NodeSQLEntity object if a match is found, or null if no node matches the conditions.
     * 
     * @example useage :
     * const node = await getNodeByMultipleFields(['email', 'nodename'], ['test@example.com', 'john_doe']);
     * 
     * @throws This method does not throw errors directly, but the underlying repository might throw errors
     * if there are issues with the database connection or query execution.
     */
    async getNodeByMultipleFields(fields: string[], values: string[]): Promise<NodeSQLEntity | null> {
        // Validate fields
        if (fields.length !== values.length || fields.length === 0 || values.length === 0) return null;

        const conditions: any = {};

        // Build conditions
        fields.forEach((field, index) => {
            conditions[field] = values[index];
        })

        // Find node
        return await this.repository.findOne({where: conditions}) || null;
    }

    async getAllNodes(): Promise<NodeSQLEntity[]> {
        // Fetch all nodes from the database
        const rawResult: NodeSQLEntity[] = await this.repository.find();
    
        // Verify if rawResult is an array or a single object
        const rowsArray = Array.isArray(rawResult) ? rawResult : [rawResult];
    
        if (rowsArray.length === 0) return [];
    
        // Return the array of nodes
        return rowsArray;
    }  

    async createNode(node: NodeSQLEntity): Promise<NodeSQLEntity | null> {
        // Insert the node in the database
        const result = await this.repository.save(node);

        // If the node is not created, return null
        if (!result) return null;
    
        // Return the node
        return this.findNodeById(node.getId()) || null;
    }

    async modifyNode(node: NodeSQLEntity): Promise<NodeSQLEntity | null> {
        // Be sur that node exists
        const existingNode: NodeSQLEntity = await this.repository.findOne({ where: { id: node.getId() } })
        if(!existingNode) return null;

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
        return !result ? false : true;
    }
   
}