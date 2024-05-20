
const { createCoreRouter } = require("@strapi/strapi").factories

const coreRouter = createCoreRouter('api::user-statistics.user-statistics');

module.exports = coreRouter;
