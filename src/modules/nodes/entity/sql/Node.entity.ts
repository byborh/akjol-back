import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, OneToOne } from "typeorm";
import { NodeAbstract } from "../Node.abstract";
import { NodeDTO } from "@modules/nodes/dto/NodeDTO";
import { NodeContract } from "@modules/nodes/contracts/INode";
import { TType } from "@modules/nodes/contracts/TType";

@Entity("nodes")
export class NodeSQLEntity extends NodeAbstract {
    @PrimaryColumn({ type: "varchar", length: 255 })
    id: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    type: TType;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "varchar", length: 255 })
    slug: string;

    @Column({ type: "text" })
    description: string;

    @Column("json", { nullable: true })
    metadata: { [key: string]: any; };

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;


    /*
    ----------------------------------------------------------------------------------
        Add liaisons here with other Entities
        Ex :
            - @OneToMany
                entityName: EntityName
            - @OneToMany
                entityName: EntityName
            - @ManyToMany
                entityName: EntityName
            - @ManyToMany
                entityName: EntityName
    ----------------------------------------------------------------------------------
    */

    constructor(data?: Partial<NodeContract>) {
        super(
            data?.id ?? "",
            data?.type ?? 'UNDEFINED',
            data?.title ?? "",
            data?.slug ?? "",
            data?.description ?? "",
            data?.metadata ?? {},
            data?.createdAt ?? new Date(),
            data?.updatedAt ?? new Date(),
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