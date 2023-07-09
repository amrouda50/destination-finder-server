'use strict';

const {initializeRegions} = require("../config/functions/initializeRegions.js");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Uncomment this to initialize an empty database with the travelRegionsRaw.json data
    // await initializeRegions({ strapi });
  },
};
