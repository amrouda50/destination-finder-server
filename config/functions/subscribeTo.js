const similarityMatrix = require("../../datasets/similarityMatrix.json");
const similarityKeys = require("../../datasets/similarityKeys.json");
const travelRegions = require("../../datasets/travelRegionsRaw.json");

const createUserStatistics = async (event) => {
  const user = await strapi.db.query('plugin::users-permissions.user')
    .findOne({ where: { email: event.params.data.email } });
  const statistics = await strapi.db.query('api::user-statistics.user-statistics')
    .create({ data: { user: user.id, visitedRegions: [], favouriteRegions: [] } });
  strapi.log.info(`User statistics was connected
      to ${event.model.attributes.id} with result ${JSON.stringify(statistics)}`);
}

const AMOUNT_OF_RECOMMENDATIONS = 20;

function normalizeValue(value, minValue = 1, maxValue = 5) {
  return (value - minValue) / (maxValue - minValue);
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


const findUserVisits = async (event) => {
  const visitId = event.result.id;
  const visit = await strapi.db.query('api::visits.visit')
    .findOne({
      where: { id: visitId },
      populate: ['user']
    });
  const userId = visit.user[0].id;
  const userVisits = await strapi.db
    .query('api::visits.visit')
    .findMany({
      where: { user: { id: userId } },
      populate: ['user', 'region']
    })
  return [userVisits, userId];
}


const onUpdateCreateVisits = async (event) => {
  const [userVisits, userId] = await findUserVisits(event);

  console.log(`User ${userId} has ${userVisits.length} visits. Creating/Adjusting recommendations...`);

  const similarityRows = [];
  const visitsReview = []
  userVisits.forEach(userVisit => {
    if (!userVisit.region) return;
    const idx = similarityKeys[userVisit.region.Region];
    similarityRows.push(similarityMatrix[idx]);
    visitsReview.push(normalizeValue(userVisit.review));
  });

  if (similarityRows.length === 0) {
    return;
  }

  console.assert(similarityRows.length === visitsReview.length);

  const sumRow = similarityRows
    .slice(1)
    .reduce((row, current) => {
      return row.map((element, idx) => element + current[idx]);
    }, similarityRows[0].map(el => el));

  // find the mean row estimation of the "best recommendation"
  const averageRow = sumRow
    .map((element, idx) =>
      ({value: element / similarityRows.length, idx}))
    .sort((e1, e2) => e2.value - e1.value);


  const regionsFromKeys = Object.keys(similarityKeys);
  const regions = travelRegions.regions;

  const indexes = Array
    .from({length: 5})
    .fill(0)
    .map((_, idx) => {
      return randomIntFromInterval(idx * 4, idx * 4 + 4)
    })

  const recommendations = averageRow
    .filter(el => !!regions[el.idx].u_name)
    .slice(0, AMOUNT_OF_RECOMMENDATIONS)
    .filter((el, idx) => indexes.includes(idx))
    .map((el) => regionsFromKeys[el.idx]);


  const regionRecommendations = await strapi.db
    .query('api::region.region')
    .findMany({where: {Region: recommendations}})

  const userStatistics = await strapi.db
    .query('api::user-statistics.user-statistics')
    .update({
      where: {user: {id: userId}},
      data: {
        recommendations: regionRecommendations
      },
      populate: ['recommendations']
    });

  console.assert(userStatistics.recommendations.length > 0);
  console.log(`Updated user statistics with regions ${recommendations}`);
}
const subscribeTo = ({strapi}) => {
  strapi.log.info("Adding strapi subscribers");
  strapi.db.lifecycles.subscribe({
    models: ['plugin::users-permissions.user'],
    async afterCreate(event){
        await createUserStatistics(event);
    },
  });

  strapi.db.lifecycles.subscribe({
    models: ['api::visits.visit'],
    async afterCreate(event){
      onUpdateCreateVisits(event);
    },
    async afterUpdate(event){
      onUpdateCreateVisits(event);
    }
  })
}


module.exports = {
  subscribeTo,
}
