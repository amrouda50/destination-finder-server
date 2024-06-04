'use strict';

/**
 * preset router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::preset.preset');
