'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraints to roles table
    await queryInterface.addConstraint('roles', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'roles_created_by_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('roles', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'roles_updated_by_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('roles', 'roles_created_by_fkey');
    await queryInterface.removeConstraint('roles', 'roles_updated_by_fkey');
  },
};
