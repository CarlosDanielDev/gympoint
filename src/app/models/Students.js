import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.INTEGER,
        height: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        gym_id: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    this.addHook('beforeSave', async student => {
      if (student.password) {
        student.password_hash = await bcrypt.hash(student.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Gyms, { foreignKey: 'gym_id', as: 'gym' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Students;
