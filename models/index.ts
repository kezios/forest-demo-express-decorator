import { readdirSync } from "fs";
import { join } from 'path';
import * as Sequelize from 'sequelize';
import databasesConfiguration from "../config/databases";

const connections: Record<string, Sequelize.Sequelize> = {};
const objectMapping = Sequelize;
const models: Record<string, typeof Sequelize.Model> = {};

databasesConfiguration.forEach((databaseInfo) => {
  const connection = new Sequelize.Sequelize(databaseInfo.connection.url, databaseInfo.connection.options);
  connections[databaseInfo.name] = connection;

  const modelsDir = databaseInfo.modelsDir || join(__dirname, databaseInfo.name);
  readdirSync(modelsDir)
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js' && !file.includes('.map'))
    .forEach((file) => {
      try {
        const model = connection.import(join(modelsDir, file));
        models[model.name] = model;
      } catch (error) {
        console.error(`Model creation error: ${error}`);
      }
    });
});

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    // @ts-ignore
    models[modelName].associate(models);
  }
});

export { objectMapping, models, connections };