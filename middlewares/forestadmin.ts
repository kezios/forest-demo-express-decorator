import { cyan } from 'chalk';
import { join } from 'path';
import { init, LianaOptions } from "forest-express-sequelize";
import { objectMapping, connections } from '../models';
import { Application } from "express";

export = async function forestadmin(app: Application): Promise<void> {
  const lianaOptions: LianaOptions = {
    configDir: join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    objectMapping,
    connections,
  }

  app.use(await init(lianaOptions));

  console.log(cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));

  return;
};