import { TType } from "../contracts/TType";

export interface NodeDTO  {
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
}
