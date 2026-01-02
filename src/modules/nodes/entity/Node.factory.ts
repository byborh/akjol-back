import { DatabaseType } from "@db/contract/DatabaseType";
import { NodeContract } from "../contracts/INode";
import { NodeSQLEntity } from "./sql/Node.entity";
import { NodeRedisEntity } from "./redis/Node.entity";
import { NodeMongoEntity } from "./mongo/Node.entity";
import { NodeAbstract } from "./Node.abstract";

const databaseType: DatabaseType = (process.env.MY_DB as DatabaseType) || "mysql"; // Default to MySQL if not specified


export async function createNodeEntity(node: Partial<NodeContract>, dbType: DatabaseType = databaseType): Promise<NodeAbstract> {

    switch(dbType) {
        case "mysql":
        case "postgresql":
        case "sqlite":
        case "mariadb":
        case "mssql":
            return new NodeSQLEntity(node);
        case "redis":
            return new NodeRedisEntity(node);
        case "mongodb":
            return new NodeMongoEntity(node);
        default:
            throw new Error("Unsupported database type.");
        
        // Add more cases for other database types that you want to support
    }
}