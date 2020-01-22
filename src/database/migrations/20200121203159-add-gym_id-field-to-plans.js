module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('plans', 'gym_id', {
      type: Sequelize.INTEGER,
      references: { model: 'gyms', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('plans', 'gym_id');
  }
};
