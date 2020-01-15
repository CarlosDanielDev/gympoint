import Sequelize, { Model } from 'sequelize';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.INTEGER,
        height: Sequelize.STRING
      },
      {
        sequelize
      }
    );
    return this;
  }
}

export default Students;
