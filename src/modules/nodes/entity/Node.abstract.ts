import { NodeContract } from "../contracts/INode";
import { TType } from "../contracts/TType";
import { NodeDTO } from "../dto/NodeDTO";

export abstract class NodeAbstract implements NodeContract {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: TType;
    title: string;
    slug: string;
    description: string;
    metadata: { [key: string]: any; };
    
    constructor(
        id: string,
        type: TType,
        title: string,
        slug: string,
        description: string,
        metadata: { [key: string]: any; },
        createdAt?: Date,
        updatedAt?: Date
    )
    {
        this.id = id;
        this.type = type;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.metadata = metadata;
        this.createdAt = createdAt ? createdAt : new Date();
        this.updatedAt = updatedAt ? updatedAt : new Date();
    }

    getId(): string {
        return this.id;
    }
    getType(): TType {
        return this.type;
    }
    getTitle(): string {
        return this.title;
    }
    getSlug(): string {
        return this.slug;
    }
    getDescription(): string {
        return this.description;
    }
    getMetadata(): { [key: string]: any; } {
        return this.metadata;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }


    setId(id: string): void {
        this.id = id;
    }
    setType(type: TType): void {
        this.type = type;
    }
    setTitle(title: string): void {
        this.title = title;
    }
    setSlug(slug: string): void {
        this.slug = slug;
    }
    setDescription(description: string): void {
        this.description = description;
    }
    setMetadata(metadata: { [key: string]: any; }): void {
        this.metadata = metadata;
    }
    setCreatedAt(createdAt: Date): void {
        this.createdAt = createdAt;
    }
    setUpdatedAt(updatedAt: Date): void {
        this.updatedAt = updatedAt;
    }

    abstract toDto(): NodeDTO;
}