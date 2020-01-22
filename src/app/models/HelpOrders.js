import Sequelize, { Model } from 'sequelize';

class HelpOrders extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE
      },
      { sequelize }
    );
    this.addHook('beforeSave', async help_orders => {
      if (help_orders.answer) {
        help_orders.answer_at = new Date();
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'student'
    });
  }
}

export default HelpOrders;
