import {DataTypes} from 'sequelize';
import {sequelize} from '../instances/pg.js';


export default sequelize.define('DoubleData', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  cor: {
    type: DataTypes.INTEGER
  },
  createdAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'DoubleData',
  timestamps: false //Não tem os campos created_at e updated_at
})