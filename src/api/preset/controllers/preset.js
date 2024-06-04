'use strict';

/**
 * preset controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::preset.preset');
