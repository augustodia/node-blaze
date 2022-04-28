import {DataTypes} from 'sequelize';
import {sequelize} from '../instances/pg.js';


export default sequelize.define('DoubleRodadasSemBranco', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  qtdrodadas: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'DoubleRodadasSemBranco',
  timestamps: false //Não tem os campos created_at e updated_at
})