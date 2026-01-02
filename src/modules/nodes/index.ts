import express from 'express';
import { NodeController } from './controllers/NodeController';
import { NodeRepositorySQL } from './repositories/drivers/NodeRepositorySQL';
import { nodeRoutes } from './route/nodeRoutes';
import { getDatabase } from '@db/DatabaseClient';
import { INodeRepository } from './repositories/contract/INodeRepository';
import { getRepository } from '@core/db/databaseGuards';
import { NodeRepositoryRedis } from './repositories/drivers/NodeRepositoryRedis';
import { NodeRepositoryMongo } from './repositories/drivers/NodeRepositoryMongo';
import { NodeService } from './services/NodeService';

export const createNodeModule = async (): Promise<express.Router> => {

  const myDB = await getDatabase();

  const nodeRepository = getRepository(myDB, NodeRepositorySQL, NodeRepositoryRedis, NodeRepositoryMongo) as INodeRepository;

  const nodeService = new NodeService(nodeRepository);
  const nodeController = new NodeController(nodeService);

  return nodeRoutes(nodeController);
};
