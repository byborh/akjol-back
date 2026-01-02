import { NodeDTO } from "../dto/NodeDTO";
import { NodeContract } from "../contracts/INode";
import { getDatabase } from "@db/DatabaseClient";
import { getRepository } from "@core/db/databaseGuards";
import { NodeRedisEntity } from "../entity/redis/Node.entity";
import { NodeAbstract } from "../entity/Node.abstract";
import { INodeRepository } from "../repositories/contract/INodeRepository";
import { NodeRepositorySQL } from "../repositories/drivers/NodeRepositorySQL";
import { NodeRepositoryRedis } from "../repositories/drivers/NodeRepositoryRedis";
import { NodeRepositoryMongo } from "../repositories/drivers/NodeRepositoryMongo";

export class NodeMapper {
    private static nodeRepository: INodeRepository;

    // Initialize the repository
    private static async initRepository() {
        if(!this.nodeRepository) {
            const myDB = await getDatabase();

            // Il faut passer par le repository, c'est mieux !
            this.nodeRepository = getRepository(myDB, NodeRepositorySQL, NodeRepositoryRedis, NodeRepositoryMongo) as INodeRepository;
        }
    }

    // Transform the dto to the entity
    static async toEntity(dto: NodeDTO): Promise<NodeAbstract> {
        if (!dto.id) throw new Error("Node ID is required.");

        // Be sur that the repository is initialized
        await this.initRepository();
        
        // Get existing node from the database
        const existingNode: NodeAbstract | null = await this.nodeRepository.findNodeById(dto.id);

        if (!existingNode) throw new Error("Node not found.");

        return ({
            id: dto.id,
            email: dto.email,
            password: existingNode.password, // Let password unchanged
            salt: existingNode.salt, // Let salt unchanged
            firstname: dto.firstname || null,
            lastname: dto.lastname || null,
            pseudo: dto.pseudo || null,
            telnumber: dto.telnumber || null,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            stripeCustomerId: dto.stripeCustomerId || null,
            paypalCustomerId: dto.paypalCustomerId || null
        } as NodeAbstract);
    }

    static async toRedisEntity(nodeDTO: NodeDTO): Promise<NodeRedisEntity> {
        if (!nodeDTO.id) throw new Error("Node ID is required.");

        // Be sur that the repository is initialized
        await this.initRepository();
        
        // Get existing node from the database
        const existingNode: NodeContract | null = await this.nodeRepository.findNodeById(nodeDTO.id);

        if (!existingNode) throw new Error("Node not found.");
        
        return new NodeRedisEntity({
            id: nodeDTO.id,
            email: nodeDTO.email,
            password: existingNode.password, // Let password unchanged
            salt: existingNode.salt, // Let salt unchanged
            firstname: nodeDTO.firstname || null,
            lastname: nodeDTO.lastname || null,
            pseudo: nodeDTO.pseudo || null,
            telnumber: nodeDTO.telnumber || null,
            createdAt: nodeDTO.createdAt,
            updatedAt: nodeDTO.updatedAt,
            stripeCustomerId: nodeDTO.stripeCustomerId || null,
            paypalCustomerId: nodeDTO.paypalCustomerId || null
        });
    }


    // Transform the entity to the dto
    static toDTO(node: NodeContract): NodeDTO { return node.toDto(); }
}
