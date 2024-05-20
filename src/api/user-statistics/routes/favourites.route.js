module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/favourites/:user',
      handler: 'api::user-statistics.user-statistics.getFavourites',
      config: {
        auth: false,
        policies: []
      },
    }
  ]
};
