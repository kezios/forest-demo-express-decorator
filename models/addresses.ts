import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';

interface IAddressAttributes {
  id: number;
  address_line_1: string;
  address_line_2: string | null;
  address_line_city: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IAddressCreationAttributes {
  address_line_1: string;
  address_line_2: string | null;
  address_line_city: string;
  country: string;
}

export class Address extends Model<IAddressAttributes, IAddressCreationAttributes> {
  public id!: number;
  public address_line_1!: string;
  public address_line_2!: string | null;
  public address_line_city!: string;
  public country!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: Record<string, ModelCtor<Model>>): void {
    Address.belongsTo(models.customers)
  }
}

export default function(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Model {

  Address.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    'address_line_1': {
      type: DataTypes.STRING
    },
    'address_line_2': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressCity: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
  },{
    tableName: 'addresses',
    underscored: true,
    modelName: 'addresses',
    sequelize,
  });

  return Address;
}