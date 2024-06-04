'use strict';

/**
 * preset service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::preset.preset');
