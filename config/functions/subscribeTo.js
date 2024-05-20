

const createUserStatistics = async (event) => {
  const user = await strapi.db.query('plugin::users-permissions.user')
    .findOne({ where: { email: event.params.data.email } });
  const statistics = await strapi.db.query('api::user-statistics.user-statistics')
    .create({ data: { user: user.id, visitedRegions: [], favouriteRegions: [] } });
  strapi.log.info(`User statistics was connected
      to ${event.model.attributes.id} with result ${JSON.stringify(statistics)}`);
}

const subscribeTo = ({strapi}) => {
  strapi.log.info("Adding strapi subscribers");
  strapi.db.lifecycles.subscribe({
    models: ['plugin::users-permissions.user'],
    async afterCreate(event){
        await createUserStatistics(event);
    }
  });
}


module.exports = {
  subscribeTo,
}
