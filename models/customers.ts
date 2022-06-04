
import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';

interface ICustomerAttributes {
  id: number;
  firstname: string | null;
  lastname: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ICustomerCreationAttributes {
  firstname: string | null;
  lastname: string | null;
  phone: string | null;
}

export class Customer extends Model<ICustomerAttributes, ICustomerCreationAttributes> {
  public id!: number;
  public firstname!: string | null;
  public lastname!: string | null;
  public phone!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: Record<string, ModelCtor<Model>>): void {
    Customer.hasOne(models.addresses)
  }
}

export default function(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Model {
  Customer.init({
    id: {
      type: dataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },{
    tableName: 'customers',
    underscored: true,
    modelName: 'customers',
    sequelize,
  });

  return Customer;
}