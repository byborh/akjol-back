import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm";
import { NodeAbstract } from "../Node.abstract";
import { NodeContract } from "@modules/nodes/contracts/INode";
import { NodeDTO } from "@modules/nodes/dto/NodeDTO";
import { AuthTokenMongoEntity } from "@modules/auth-token/entity/mongo/AuthToken.entity";
import { ChatAIMongoEntity } from "@modules/chat-ai/entity/mongo/ChatAI.entity";
import { TType } from "@modules/nodes/contracts/TType";
import { get, set } from "lodash";

@Entity("nodes")
export class NodeMongoEntity extends NodeAbstract {
    @ObjectIdColumn()
    id: string;

    @Column()
    type: TType;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column()
    description: string;

    @Column({  })
    metadata: { [key: string]: any; };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;    

    constructor(data?: Partial<NodeContract>) {
        super(
            data?.id ?? "",
            data?.type ?? 'UNDEFINED',
            data?.title ?? "",
            data?.slug ?? "",
            data?.description ?? "",
            data?.metadata ?? {},
            data?.createdAt ?? new Date(),
            data?.updatedAt ?? new Date()
        );
    
        this.id = data?.id ?? "";
        this.type = data?.type ?? 'UNDEFINED';
        this.title = data?.title ?? "";
        this.slug = data?.slug ?? "";
        this.description = data?.description ?? "";
        this.metadata = data?.metadata ?? {};
        this.createdAt = data?.createdAt ?? new Date();
        this.updatedAt = data?.updatedAt ?? new Date();
    }
      
    getId(): string {return this.id;}
    getType(): TType {return this.type;}
    getTitle(): string {return this.title;}
    getSlug(): string {return this.slug;}
    getDescription(): string {return this.description;}
    getMetadata(): { [key: string]: any; } {return this.metadata;}
    getCreatedAt(): Date {return this.createdAt;}
    getUpdatedAt(): Date {return this.updatedAt;}
    
    
    setId(id: string): void {this.id = id;}
    setType(type: TType): void {this.type = type;}
    setTitle(title: string): void {this.title = title;}
    setSlug(slug: string): void {this.slug = slug;}
    setDescription(description: string): void {this.description = description;}
    setMetadata(metadata: { [key: string]: any; }): void {this.metadata = metadata;}
    setCreatedAt(date: Date): void {this.createdAt = date;}
    setUpdatedAt(date: Date): void {this.updatedAt = date;}

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