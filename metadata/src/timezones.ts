// https://www.techighness.com/post/get-user-country-and-region-on-browser-with-javascript-only/

/* 
    I just found out that choosing any timezone in India returns “Calcutta” instead of “Kolkata”
    (as found in the moment-timezone). So I have manually added the key “Calcutta” in the JSON that can be downloaded below.
    You should double-check the countries you’re interested in, and if they’re missing, add them manually.
*/

import { countries, zones } from 'moment-timezone/data/meta/latest.json';

import fs from 'fs-extra';
import path from 'path';


/* 
zones => {
    "Europe/Andorra": {
        "name": "Europe/Andorra",
        "lat": 42.5,
        "long": 1.5167,
        "countries": [
            "AD"
        ],
        "comments": ""
    },
    "Asia/Bangkok": {
        "name": "Asia/Bangkok",
        "lat": 13.75,
        "long": 100.5167,
        "countries": [
            "TH",
            "CX",
            "KH",
            "LA",
            "VN"
        ],
        "comments": "north Vietnam"
    },
...}

countries => {
    "FR": {
        "name": "France",
        "abbr": "FR",
        "zones": [
            "Europe/Paris"
        ]
    },
    "GD": {
        "name": "Grenada",
        "abbr": "GD",
        "zones": [
            "America/Puerto_Rico",
            "America/Grenada"
        ]
    },
...}

*/

type CountryCode = keyof typeof countries;
type TimezoneCityToCountryMap = Record<string, { countryName: string; countryCode: CountryCode; }>;


const { cityToCountry, countryCodeToCity } = Object.keys(zones).reduce((data, timezoneName: keyof typeof zones) => {
    const city = timezoneName.split("/").at(-1);
    /* 
        Note that for a given zone, we take the first country it has listed (zones[z].countries[0]).
        I have checked this and verified that the first country is the actual country of a particular zone
        (the combination of region/city). For instance, “Asia/Riyadh” has Saudia Arabia as the first country in the array
    */
    const countryCode = zones[ timezoneName ].countries[ 0 ] as CountryCode;
    const { name } = countries[ countryCode ];

    return {
        cityToCountry: { ...data.cityToCountry, [ city ]: { countryName: name, countryCode } },
        countryCodeToCity: { ...data.countryCodeToCity, [ countryCode ]: city }
    };

}, { cityToCountry: {} as TimezoneCityToCountryMap, countryCodeToCity: {} as Record<CountryCode, string> });



/* if (Intl) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzArr = userTimeZone.split("/");
    const userRegion = tzArr[ 0 ];
    const userCity = tzArr[ tzArr.length - 1 ];
    const userCountry = timeZoneCityToCountry[ userCity ];

    console.log("Time Zone:", userTimeZone);
    console.log("Region:", userRegion);
    console.log("City:", userCity);
    console.log("Country:", userCountry);
} */


const writeMetadata = (filepath: string, options: { filterCountries?: CountryCode[]; } = {}) => {
    const { filterCountries } = options;

    const filteredCityToCountry = filterCountries ? filterCountries.reduce((data, countryCode) => {
        const city = countryCodeToCity[ countryCode ];
        const item = cityToCountry[ city ];

        return !!item ? { ...data, [ city ]: item } : data;
    }, {} as TimezoneCityToCountryMap) : cityToCountry;

    const filename = (extension: string) => {
        const { dir, name, ext } = path.parse(filepath);
        return path.join(dir, `${name}-${extension}${ext}`);
    };

    Promise.all([
        { file: filename('filtered'), data: filteredCityToCountry },
        { file: filename('all'), data: cityToCountry },
    ].map(({ file, data }) => {
        const relPath = path.relative(process.cwd(), file);

        return fs.outputJson(file, data)
            .then(() => { console.log(`File "${relPath}": written!`); })
            .catch(e => { console.error(`Error writing file "${relPath}"`, e); });
    })).then(() => {
        console.log('\nFinished!');
    });
};


const args = process.argv.slice(2);
const countryCodes = args[ 0 ]?.split(',').map(s => s.trim()) as CountryCode[];

writeMetadata(path.resolve(__dirname, '../json/timezone-country.json'), { filterCountries: countryCodes });
