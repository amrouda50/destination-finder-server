

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-statistics.user-statistics',  ({ strapi }) => ({
  async getFavourites(ctx) {
    const user = ctx.params['user'];
    const statistics = await strapi.db
      .query('api::user-statistics.user-statistics')
      .findOne({
        where: {user},
        populate: {
          favouriteRegions: true,
        }
      });
    return ctx.send(statistics.favouriteRegions);
  },
  async updateFavourites(ctx) {
    const user = ctx.params['user'];
    const favourites = ctx.request.body;
    const statistics = await strapi.db
      .query('api::user-statistics.user-statistics')
      .findOne({
        where: {user},
      });

    const updateRes = await strapi.entityService.update('api::user-statistics.user-statistics', statistics.id, {
      data: { favouriteRegions: favourites }
    })
    return ctx.send(updateRes);
  }
}));
