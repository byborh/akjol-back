import { NodeDTO } from '@modules/nodes/dto/NodeDTO';
import { NodeAbstract } from '../Node.abstract';
import { NodeContract } from '@modules/nodes/contracts/INode';
import { TType } from '@modules/nodes/contracts/TType';

export class NodeRedisEntity extends NodeAbstract {
    id: string;
    type: TType;
    title: string;
    slug: string;
    description: string;
    metadata: { [key: string]: any; };
    createdAt: Date;
    updatedAt: Date;


    constructor(data: Partial<NodeContract>) {
        super(data.id!, data.type!, data.title!, data.slug!, data.description!, data.metadata!, data.createdAt, data.updatedAt);

        this.id = data.id!;
        this.type = data.type!;
        this.title = data.title!;
        this.slug = data.slug!;
        this.description = data.description!;
        this.metadata = data.metadata!;
        this.createdAt = data.createdAt ?? new Date();
        this.updatedAt = data.updatedAt ?? new Date();
    }

    // Convert object to Redis hash
    toRedisHash(): { [key: string]: string } {
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            slug: this.slug,
            description: this.description,
            metadata: JSON.stringify(this.metadata),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    };


    // Convert Redis hash to object
    static fromRedisHash(hash: { [key: string]: string }): NodeRedisEntity {
        return new NodeRedisEntity({
            id: hash.id,
            type: hash.type as TType,
            title: hash.title,
            slug: hash.slug,
            description: hash.description,
            metadata: JSON.parse(hash.metadata),
            createdAt: hash.createdAt ? new Date(hash.createdAt) : new Date(),
            updatedAt: hash.updatedAt ? new Date(hash.updatedAt) : new Date(),
            
        });
    }

    toDto(): NodeDTO {
        return {
            id: this.id,
            type: this.type,
            title: this.title,
            slug: this.slug,
            description: this.description,
            metadata: this.metadata,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}