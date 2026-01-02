import { NodeDTO } from "../dto/NodeDTO";
import { TType } from "./TType";

// Interface of the node
export interface NodeContract {
    id: string;
    type: TType;
    title: string;
    slug: string;
    description: string;
    metadata: {
        [key: string]: any;
    };
    createdAt: Date;
    updatedAt: Date;

    // todo: let it ?
    toDto(): NodeDTO;
}

/*
    Example of possible metadata structure:

    data: {
        salary_min?: number;    // Pour les Jobs
        salary_max?: number;    // Pour les Jobs
        duration_years?: number;// Pour les études
        school_type?: string;   // 'Public', 'Privé'
        tags?: string[];        // ['Informatique', 'Réseau']
    };

*/