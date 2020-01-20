module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'password_hash', {
      type: Sequelize.STRING
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('students', 'password_hash');
  }
};
