import AbstractComponent from './abstract-component';
import { MONTHS } from '../const';

const getBorderPoints = (points) => {
  return {
    firstPoint: points[0],
    lastPoint: points[points.length - 1],
  };
};

const calculateAdditionalPrice = (offers) => {
  return offers.reduce((acc, cur) => {
    return acc + cur.price;
  }, 0);
};

const calculatePrice = (points) => {
  return points.reduce((acc, cur) => {
    let offersPrice = 0;

    if (cur.offers.length > 0) {
      offersPrice = calculateAdditionalPrice(cur.offers);
    }

    return acc + cur.base_price + offersPrice;
  }, 0);
};

const createTripCitiesTemplate = (points) => {
  let tripCitiesString = '';

  switch (points.length) {
    case 0:
      tripCitiesString = 'There is no points yet';
      break;
    case 1:
      tripCitiesString = `<h1 class="trip-info__title">${points[0].destination.name}</h1>`;
      break;
    case 2:
      tripCitiesString = `<h1 class="trip-info__title">${points[0].destination.name} &mdash; ${points[1].destination.name}</h1>`;
      break;
    case 3:
      tripCitiesString = `<h1 class="trip-info__title">${points[0].destination.name} &mdash; ${points[1].destination.name}  &mdash; ${points[2].destination.name}</h1>`;
      break;
    default:
      tripCitiesString = `<h1 class="trip-info__title">${points[0].destination.name} &mdash; ... &mdash; ${points[points.length - 1].destination.name}</h1>`;
      break;
  }

  return tripCitiesString;
};

const getTripDates = (points) => {
  const dateFrom = new Date(points.firstPoint.date_from);
  const dateTo = new Date(points.lastPoint.date_from);
  const dayFrom = dateFrom.getDate();
  const dayTo = dateTo.getDate();
  const monthFrom = MONTHS[dateFrom.getMonth()];
  const monthTo = dateTo.getMonth() === dateFrom.getMonth() ? '' : MONTHS[dateTo.getMonth()];

  return {
    dayFrom,
    dayTo,
    monthFrom,
    monthTo,
  };
};

const createTripInfoTemplate = (points) => {
  const {
    dayFrom,
    dayTo,
    monthFrom,
    monthTo,
  } = getTripDates(getBorderPoints(points));

  const tripCities = createTripCitiesTemplate(points);

  const price = calculatePrice(points);

  return (
    `<section class="trip-main__trip-info trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${tripCities}</h1>

          <p class="trip-info__dates">${monthFrom} ${dayFrom}&nbsp;&mdash;&nbsp;${monthTo} ${dayTo}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
        </p>
      </section>
  `);
};

export default class TripInfo extends AbstractComponent {
  #points = null;

  constructor(points) {
    super();

    this.#points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this.#points);
  }
}
