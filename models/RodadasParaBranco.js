import {DataTypes} from 'sequelize';
import {sequelize} from '../instances/pg.js';


export default sequelize.define('RodadasParaBranco', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  qtdrodadas: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'RodadasParaBranco',
  timestamps: false //Não tem os campos created_at e updated_at
})