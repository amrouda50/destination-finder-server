module.exports = {
  routes: [
    {
        method: 'GET',
        path: '/favourites/:user',
        handler: 'api::favourites.favourites.getFavourites',
        config: {
          policies: [],
          auth: false
        },
      },
      {
        method: 'PUT',
        path: '/favourites/:user',
        handler: 'api::favourites.favourites.updateFavourites',
        config: {
          policies: [],
          auth: false
        },
      }
  ],
};
