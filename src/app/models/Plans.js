import Sequelize, {Model} from 'sequelize';

class Plans extends Model  {
  static init(sequelize){
    super.init({
      title: Sequelize.STRING,
      duration: Sequelize.INTEGER,
      price: Sequelize.DECIMAL
    },
    {
      sequelize
    })
  }
}

export default Plans;
