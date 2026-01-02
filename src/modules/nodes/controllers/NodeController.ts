import { Request, Response, NextFunction } from "express";
import { IdGenerator } from "@core/idGenerator";
import { NodeAbstract } from "../entity/Node.abstract";
import { NodeService } from "../services/NodeService";

export class NodeController {
    constructor(private readonly nodeService: NodeService) {}

    // Get a node by ID
    public async getNodeById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const nodeDto = await this.nodeService.getNodeById(req.params.id);
            if (!nodeDto) {
                res.status(404).json({ error: "Node not found" });
                return;
            }
            res.status(200).json(nodeDto);
        } catch (error) {
            next(error);
        }
    }

    // Get all nodes
    public async getAllNodes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const nodes = await this.nodeService.getNodes();
            if (!nodes || nodes.length === 0) {
                res.status(404).json({ error: "No nodes found" });
                return;
            }
            res.status(200).json(nodes);
        } catch (error) {
            next(error);
        }
    }

    // Create a node
    public async createNode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, firstname, lastname, pseudo, telnumber } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: "Email and password are required." });
                return;
            }

            const idGenerator = IdGenerator.getInstance();
            const nodeId: string = idGenerator.generateId();

            // const node: NodeAbstract = ({
            //     id: nodeId,
            //     type: "UserNode",
            //     title: "",
            //     slug: "",
            //     metadata: {},
            //     description: "",
            //     createdAt: new Date(),
            //     updatedAt: new Date(),

            // } as NodeAbstract);
            
            const createdNode = await this.nodeService.createNode(x as NodeAbstract);

            if (!createdNode) {
                res.status(400).json({ error: "Node could not be created." });
                return;
            }

            res.status(201).json(createdNode);
        } catch (error) {
            next(error);
        }
    }

    // Modify a node
    public async modifyNode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, firstname, lastname, pseudo, telnumber } = req.body;

            // Verify if id is provided
            if (!req.params.id) {
                res.status(400).json({ error: "Node id is required." });
                return;
            }
    
            const updatedNode = await this.nodeService.modifyNode(req.params.id, {
                email, password, firstname, lastname, pseudo, telnumber
            });
    
            if (!updatedNode) {
                res.status(404).json({ error: "Node could not be modified." });
                return;
            }
    
            res.status(200).json(updatedNode);
        } catch (error) {
            next(error);
        }
    }
    

    // Delete a node
    public async deleteNode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isDeleted = await this.nodeService.deleteNode(req.params.id);
            if (!isDeleted) {
                res.status(404).json({ error: "Node could not be deleted." });
                return;
            }
            res.status(200).json({ message: "Node deleted successfully." });
        } catch (error) {
            next(error);
        }
    }
}
