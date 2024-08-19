import "fs";

const regions = require("./travelRegionsRaw.json");
const countries = require("./countriesToCode.json");


const regionToIndex = regions.regions.reduce((prev, r, idx) => ({...prev, [r.Region]: idx }), {})

const justCountries = Object.values(countries);
const countryCodes = Object.keys(countries);

const pattern = / |, /;
const bannedWords = ['and', 'islands', 'republic', 'north', 'south', 'west', 'east']
const regionToCountries = (region) => {
    const countryIndexes = region.split(pattern)
        .filter(r => !bannedWords.includes(r.toLowerCase()))
        .map(r => {
            return justCountries.find(c => c.split(pattern).some(i => i === r));
        })
        .map(country => justCountries.findIndex(c => country === c));

    const noDupCountryIndexes = [...new Set(countryIndexes)].filter(c => c !== -1);

    // console.log(noDupCountryIndexes);
    return noDupCountryIndexes.map(idx => countryCodes[idx]);
};

const regionAllChildren = (parentRegion) => {
    const children = regions.regions.filter(r => r.ParentRegion === parentRegion).map(r => r.Region);
    return children.concat(children.flatMap(child => regionAllChildren(child)));
}

const regionsToCountries = (regions) => {
    return regions.flatMap(r => regionToCountries(r));
}

const regionsWithChildren = regions.regions.map(region => ({
    ...region,
    countries: regionsToCountries(regionAllChildren(region.Region)).concat(regionToCountries(region.Region))
 }));


// console.log(regionToCountries("Bahamas, Turks and Caicos Islands"));
// console.log(regionToCountries("Arentina"));
// console.log(regionAllChildren(regions.regions[0].Region));

const fs = require('fs');

fs.appendFile('travelRegionsWithCountries.json', JSON.stringify(regionsWithChildren), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
// regions.regions.map(region => {
//     processRegion(region);
// });
