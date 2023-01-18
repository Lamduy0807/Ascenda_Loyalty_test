const _ = require("./node_modules/lodash");
const dayjs = require("./node_modules/dayjs");

/**OFFERS can be got from API...*/
const OFFERS = [
  {
    id: 1,
    title: "Offer 1",
    description: "Offer 1 description",
    category: 1,
    merchants: [{ id: 1, name: "Offer1 Merchant1", distance: 0.5 }],
    valid_to: "2020-02-01",
  },
  {
    id: 2,
    title: "Offer 2",
    description: "Offer 2 description",
    category: 2,
    merchants: [{ id: 2, name: "Offer2 Merchant1", distance: 1.3 }],
    valid_to: "2019-12-01",
  },
  {
    id: 3,
    title: "Offer 3",
    description: "Offer 3 description",
    category: 2,
    merchants: [
      { id: 3, name: "Offer3 Merchant1", distance: 0.8 },
      { id: 4, name: "Offer3 Merchant2", distance: 0.9 },
    ],
    valid_to: "2020-01-01",
  },
  {
    id: 4,
    title: "Offer 4",
    description: "Offer 4 description",
    category: 3,
    merchants: [{ id: 5, name: "Offer4 Merchant1", distance: 0.3 }],
    valid_to: "2020-05-01",
  },
  {
    id: 5,
    title: "Offer 5",
    description: "Offer 5 description",
    category: 4,
    merchants: [{ id: 6, name: "Offer5 Merchant1", distance: 1.2 }],
    valid_to: "2020-05-01",
  },
  {
    id: 6,
    title: "Offer 6",
    description: "Offer 6 description",
    category: 2,
    merchants: [{ id: 7, name: "Offer6 Merchant1", distance: 1.3 }],
    valid_to: "2020-05-01",
  },
];

getValidOffers(OFFERS, "2019-12-25").map((i) => { console.log(i);})


/**
 * Get 2 valid offers in array offers
 * @param {array} offers 
 * @param {string} bookingDate 
 * @returns {array}
 */
function getValidOffers(offers, bookingDate) {
  let index = 1;
  
  /**1. Filter offers (do not have category = 3 and not expired booking day) */
  let Offer = _.filter(offers, (i) => {
    return i.category !== 3 && checkExpiredDay(bookingDate, i.valid_to);
  });

  /**2. Find min distance in merchants in each offers, replace other merchant*/
  Offer.forEach((off) => {
    if (off.merchants.length > 1) {
      let minDistance = Math.min.apply(
        Math,
        off.merchants.map(function (i) {
          return i.distance;
        })
      );
      off.merchants = off.merchants.filter(
        (mer) => mer.distance === minDistance
      );
    }
  });

  /**3. Sort array by distance of merchants in each offer */
  Offer = _.sortBy(Offer, (off) => {
    return off.merchants[0].distance;
  });

  /**4. Get the result */
  let result = [Offer[0]];
  while (result.length < 2 && index <= Offer.length) {
    if (Offer[index].category !== Offer[0].category) {
      result.push(Offer[index]);
    } else {
      index++;
    }
  }

  return result;
}

/**
 * Check expired booking day
 * @param {string} bookingDate 
 * @param {string} validDate 
 * @returns {boolean}
 */
function checkExpiredDay(bookingDate, validDate) {

  const startTime = dayjs(validDate, "YYYY-MM-DD");
  const bookingTime = dayjs(bookingDate, "YYYY-MM-DD");
  const expirationTime = startTime.add(5, "d");

  let isValid = expirationTime.isAfter(bookingTime);

  return isValid;
}
