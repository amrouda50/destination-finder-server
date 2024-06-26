'use strict';

const {initializeRegions} = require("../config/functions/initializeRegions.js");
const { subscribeTo } = require("../config/functions/subscribeTo");

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
    subscribeTo({strapi});
    await initializeRegions({ strapi });
    console.table(strapi.server.listRoutes().map((r) => ({ path: r.path, methods: r.methods?.join(', ').slice(0, 20) })));
  },
};
