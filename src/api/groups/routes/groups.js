
module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/groups/:user',
      handler: 'api::groups.groups.updateGroups',
      config: {
        policies: [],
        auth: false
      },
    }
  ],
};
