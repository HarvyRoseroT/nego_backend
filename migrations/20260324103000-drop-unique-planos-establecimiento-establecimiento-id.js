'use strict';

module.exports = {
  async up(queryInterface) {
    const indexName = 'planos_establecimiento_establecimiento_id_idx';

    try {
      const indexes = await queryInterface.showIndex('planos_establecimiento');

      const uniqueIndex = indexes.find(
        (index) =>
          index.unique &&
          index.fields?.length === 1 &&
          index.fields[0]?.attribute === 'establecimiento_id'
      );

      if (uniqueIndex?.name) {
        await queryInterface.removeIndex('planos_establecimiento', uniqueIndex.name);
      }

      const remainingIndexes = await queryInterface.showIndex('planos_establecimiento');
      const hasNonUniqueIndex = remainingIndexes.some(
        (index) =>
          !index.unique &&
          index.fields?.length === 1 &&
          index.fields[0]?.attribute === 'establecimiento_id'
      );

      if (!hasNonUniqueIndex) {
        await queryInterface.addIndex('planos_establecimiento', ['establecimiento_id'], {
          name: indexName
        });
      }
    } catch (error) {
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      const indexes = await queryInterface.showIndex('planos_establecimiento');
      const hasUniqueIndex = indexes.some(
        (index) =>
          index.unique &&
          index.fields?.length === 1 &&
          index.fields[0]?.attribute === 'establecimiento_id'
      );

      if (!hasUniqueIndex) {
        await queryInterface.addConstraint('planos_establecimiento', {
          fields: ['establecimiento_id'],
          type: 'unique',
          name: 'planos_establecimiento_establecimiento_id_key'
        });
      }
    } catch (error) {
      throw error;
    }
  }
};
