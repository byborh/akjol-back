import { NodeDTO } from "../dto/NodeDTO";

// Interface of the node
export interface NodeContract {
    id: string;
    firstname?: string;
    lastname?: string;
    pseudo?: string;
    email: string;
    password: string;
    salt: string;
    telnumber?: string;
    createdAt: Date;
    updatedAt: Date;

    stripeCustomerId?: string; // Optional
    paypalCustomerId?: string; // Optional

    toDto(): NodeDTO;
}