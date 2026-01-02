import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm";
import { NodeAbstract } from "../Node.abstract";
import { NodeContract } from "@modules/nodes/contracts/INode";
import { NodeDTO } from "@modules/nodes/dto/NodeDTO";
import { AuthTokenMongoEntity } from "@modules/auth-token/entity/mongo/AuthToken.entity";
import { ChatAIMongoEntity } from "@modules/chat-ai/entity/mongo/ChatAI.entity";

@Entity("nodes")
export class NodeMongoEntity extends NodeAbstract {
    @ObjectIdColumn()
    id: string;

    @Column({ nullable: true })
    firstname?: string | null;

    @Column({ nullable: true })
    lastname?: string | null;

    @Column({ nullable: true })
    pseudo?: string | null;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    telnumber?: string | null;

    @Column()
    salt: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    data: Record<string, any> | null;

    

    constructor(data?: Partial<NodeContract>) {
        super(
            data?.id ?? "",
            data?.email ?? "",
            data?.password ?? "",
            data?.salt ?? "",
            data?.firstname ?? null,
            data?.lastname ?? null,
            data?.pseudo ?? null,
            data?.telnumber ?? null,
            data?.createdAt ?? new Date(),
            data?.updatedAt ?? new Date()
        );
    
        this.id = data?.id ?? "";
        this.email = data?.email ?? "";
        this.password = data?.password ?? "";
        this.salt = data?.salt ?? "";
        this.firstname = data?.firstname ?? null;
        this.lastname = data?.lastname ?? null;
        this.pseudo = data?.pseudo ?? null;
        this.telnumber = data?.telnumber ?? null;
        this.createdAt = data?.createdAt ?? new Date();
        this.updatedAt = data?.updatedAt ?? new Date();
    }
      
    getId(): string {return this.id;}
    getFirstname(): string | null {return this.firstname;}
    getEmail(): string {return this.email;}
    getPassword(): string {return this.password;}
    getSalt(): string | null {return this.salt;}
    getPseudo(): string | null {return this.pseudo;}
    getLastname(): string | null {return this.lastname;}
    getTelnumber(): string | null {return this.telnumber;}
    getCreatedAt(): Date {return this.createdAt;}
    getUpdatedAt(): Date {return this.updatedAt;}
    
    
    setId(id: string): void {this.id = id;}
    setEmail(email: string): void {this.email = email;}
    setPassword(password: string): void {this.password = password;}
    setSalt(salt: string): void {this.salt = salt;}
    setPseudo(pseudo: string): void {this.pseudo = pseudo;}
    setFirstname(firstname: string): void {this.firstname = firstname;}
    setLastname(lastname: string): void {this.lastname = lastname;}
    setTelnumber(telnumber: string): void {this.telnumber = telnumber;}
    setCreatedAt(date: Date): void {this.createdAt = date;}
    setUpdatedAt(date: Date): void {this.updatedAt = date;}

    toDto(): NodeDTO {
        return {
            id: this.id,
            email: this.email,
            firstname: this.firstname,
            lastname: this.lastname,
            pseudo: this.pseudo,
            telnumber: this.telnumber,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            stripeCustomerId: this.stripeCustomerId,
            paypalCustomerId: this.paypalCustomerId
        }
    }
}