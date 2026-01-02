import { NodeDTO } from "../dto/NodeDTO";
import { NodeMapper } from "../mapper/NodeMapper";
import { PasswordManager } from "@core/cryptography/PasswordManager";
import { getDatabase } from "@db/DatabaseClient";
import { INodeRepository } from "../repositories/contract/INodeRepository";
import { NodeAbstract } from "../entity/Node.abstract";
import { createNodeEntity } from "../entity/Node.factory";
import _ from "lodash";


export class NodeService {
    constructor(private nodeRepository: INodeRepository) {}

    // Get a node by ID
    public async getNodeById(nodeId: string): Promise<NodeDTO | null> {
        try {
            // Verify if nodeId is provided
            if (!nodeId) {
                throw new Error("Node ID is required.");
            }

            // Call NodeRepository to find a node by ID
            const nodeEntity: NodeAbstract = await this.nodeRepository.findNodeById(nodeId);

            // If no node is found, return null
            if (!nodeEntity) {
                throw new Error("Node not found.");
            }

            // Transform the entity to the dto
            const nodeDTO: NodeDTO = NodeMapper.toDTO(nodeEntity);

            // Return the node
            return nodeDTO;
        } catch (error) {
            console.error("Error finding node in NodeService:", error);
            throw new Error("Failed to find node by id.");
        }
    }

    // Get a node by Email
    public async getNodeByEmail(email: string): Promise<NodeDTO | null> {
        try {
            // Verify if email is provided
            if (!email) throw new Error("Email is required.");

            // Call NodeRepository to find a node by email
            const nodeEntity: NodeAbstract = await this.nodeRepository.findNodeBySlug(email);

            // If no node is found, return null
            if (!nodeEntity) {
                throw new Error("Node not found.");
            }

            // Transform the entity to the dto
            const nodeDTO: NodeDTO = NodeMapper.toDTO(nodeEntity);

            // Return the node
            return nodeDTO;
        } catch (error) {
            console.error("Error finding node by email in NodeService:", error);
            throw new Error("Failed to find node by email.");
        }
    }

    // Get all nodes
    public async getNodes(): Promise<Array<NodeDTO> | null> {
        try {
            // Call NodeRepository to find all nodes
            const nodesEntity: NodeAbstract[] = await this.nodeRepository.getAllNodes();

            // If no nodes are found, return null
            if (!nodesEntity) return null;

            // Return all nodes in DTO format
            return nodesEntity.map(nodeEntity => NodeMapper.toDTO(nodeEntity));
        } catch (error) {
            console.error("Error finding nodes in NodeService:", error);
            throw new Error("Failed to find nodes.");
        }
    }
    
    // Create node
    public async createNode(node: NodeAbstract): Promise<NodeDTO | null> {
        try {
            // Factory to create a correct type of node entity
            const nodeEntity = await createNodeEntity(node);

            // Verify if node exists
            const localNode: NodeAbstract | null = await this.nodeRepository.findNodeBySlug(nodeEntity.slug);
            if (localNode) {
                console.error("Node already exists:", localNode);
                throw new Error("Node already exists.");
            }

            // Password management
            const passwordManager = PasswordManager.getInstance();

            // Creation of the salt
            const salt: string = passwordManager.generateSalt();

            // Creation of hashed password
            const hashedPassword: string = passwordManager.hashPassword(nodeEntity.slug, salt);

            // Verification of password
            // const isPasswordValid: boolean = passwordManager.verifyPassword(nodeEntity.password, salt, hashedPassword); // IL N'EST PAS UTILISE ???

            // Assign hashed password to node
            nodeEntity.setSlug(hashedPassword);
            nodeEntity.setSlug(salt);

            // Create node from repository
            const createdNode: NodeAbstract | null = await this.nodeRepository.createNode(nodeEntity);

            // Node didn't created
            if (!createdNode) throw new Error("Node didn't created...")

            // Initialize the Database
            const myDB = await getDatabase();

            // Initialize the repository
            // Role repository
            // const roleRepository = getRepository(myDB, RoleRepositorySQL, RoleRepositoryRedis, RoleRepositoryMongo) as IRoleRepository;
            // // NodeRoles repository
            // const nodeRolesRepository = getRepository(myDB, NodeRolesRepositorySQL, NodeRolesRepositoryRedis, NodeRolesRepositoryMongo) as INodeRolesRepository;
            // // AuthToken repositoryé&
            // const authTokenRepository = getRepository(myDB, AuthTokenRepositorySQL, AuthTokenRepositoryRedis, AuthTokenRepositoryMongo) as IAuthTokenRepository;

            // const createToken = CreateToken.getInstance(authTokenRepository);

            // // Attribute USER role
            // const createRoleAndTokenForNode = CreateRoleAndTokenForNode.getInstance(roleRepository, nodeRolesRepository, createToken);
            // const authToken: AuthTokenAbstract | null = await createRoleAndTokenForNode.createRoleAndTokenForNode(createdNode.getId());

            // if(!authToken) throw new Error("Attribution of role or token didn't created...");

            // Entity to DTO
            const nodeDTO: NodeDTO = NodeMapper.toDTO(createdNode);
            return nodeDTO;
        } catch (error) {
            console.error("Error creating node in NodeService:", error);
            throw new Error("Failed to create node.");
        }
    }

    // Modify node
    public async modifyNode(nodeId: string, node: Partial<NodeAbstract>): Promise<NodeDTO | null> {
        try {
            // Factory to create a correct type of node entity
            const nodeEntity = await createNodeEntity(node);

            // Verify if node exists
            const existingNodeDTO: NodeDTO | null = await this.getNodeById(nodeId);
            if (!existingNodeDTO) {
                throw new Error("Node not found.");
            }
    
            // Mapp the DTO to the entity
            const existingNode: NodeAbstract = await NodeMapper.toEntity(existingNodeDTO);

            // Factory to create a correct type of node entity
            const existingNodeEntity = await createNodeEntity(existingNode);
    
            // Variable to track changes
            let hasChanges: boolean = false;
    
            // Compare fields and update if necessary
            // if (nodeEntity.email && nodeEntity.email !== existingNodeEntity.email) {
            //     existingNodeEntity.setEmail(nodeEntity.email);
            //     hasChanges = true;
            // }
    
            // if (nodeEntity.firstname && nodeEntity.firstname !== existingNodeEntity.firstname) {
            //     existingNodeEntity.setFirstname(nodeEntity.firstname);
            //     hasChanges = true;
            // }
    
            // if (nodeEntity.lastname && nodeEntity.lastname !== existingNodeEntity.lastname) {
            //     existingNodeEntity.setLastname(nodeEntity.lastname);
            //     hasChanges = true;
            // }
    
            // if (nodeEntity.pseudo && nodeEntity.pseudo !== existingNodeEntity.pseudo) {
            //     existingNodeEntity.setPseudo(nodeEntity.pseudo);
            //     hasChanges = true;
            // }
    
            // if (nodeEntity.telnumber && nodeEntity.telnumber !== existingNodeEntity.telnumber) {
            //     existingNodeEntity.setTelnumber(nodeEntity.telnumber);
            //     hasChanges = true;
            // }
    
            // Verify password
            if (nodeEntity.slug) {
                const passwordManager = PasswordManager.getInstance();
                const isPasswordValid: boolean = passwordManager.verifyPassword(
                    nodeEntity.slug,
                    existingNodeEntity.slug,
                    existingNodeEntity.slug
                );
    
                // If password is different
                if (!isPasswordValid) {
                    const newSalt = passwordManager.generateSalt();
                    const hashedPassword = passwordManager.hashPassword(nodeEntity.slug, newSalt);
                    existingNodeEntity.setSlug(newSalt);
                    existingNodeEntity.setSlug(hashedPassword);
                    hasChanges = true;
                }
            }
    
            // If no changes are detected, do nothing
            if (!hasChanges) {
                throw new Error("No changes detected.");
            }
    
            // Mise à jour de la date de modification
            // Update the updatedAt field
            existingNodeEntity.setUpdatedAt(new Date());
    
            // Update the node in DB
            const updatedNode: NodeAbstract | null = await this.nodeRepository.modifyNode(existingNodeEntity);
    
            // If node didn't updated, return null
            if (!updatedNode) {
                throw new Error("Node not updated.");
            }
    
            // Return the updated node without sensitive nodeEntity
            return NodeMapper.toDTO(updatedNode);
        } catch (error) {
            console.error("Error modifying node in NodeService:", error);
            throw new Error("Failed to modify node.");
        }
    }    

    // Delete node
    public async deleteNode(nodeId: string): Promise<boolean> {
        try {
            // Verify if nodeId is provided
            if (!nodeId) {
                throw new Error("Node ID is required.");
            }

            // Find the node by ID
            const node: NodeDTO | null = await this.getNodeById(nodeId);
            if (!node) {
                console.error("Node not found:", nodeId);
                return false;
            }

            // Delete the node
            const isDeleted: boolean = await this.nodeRepository.deleteNode(nodeId);

            // Return true if the node is deleted, false otherwise
            return isDeleted;
        } catch (error) {
            console.error("Error deleting node in NodeService:", error);
            throw new Error("Failed to delete node.");
        }
    }
}