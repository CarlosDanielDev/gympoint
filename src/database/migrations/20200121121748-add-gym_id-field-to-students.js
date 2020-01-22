module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'gym_id', {
      type: Sequelize.INTEGER,
      references: { model: 'gyms', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('students', 'gym_id');
  }
};
