import { MONTHS } from '../const';

const addLeadingZero = (num) => {
  return num < 10 ? `0${num}` : num;
};

const getEventDuration = (timeFrom, timeTo) => {
  let duration = '';
  const eventDurationHours = Math.floor(((timeTo - timeFrom) / 60000) / 60);
  const eventDurationMinutes = Math.round(((timeTo - timeFrom) / 60000) % 60);

  const hours = eventDurationHours === 0 ? '' : `${eventDurationHours}H`;
  const minutes = eventDurationMinutes === 0 ? '' : `${eventDurationMinutes}M`;
  if (hours && minutes) {
    duration = `${hours} ${minutes}`;
  } else if (hours && !minutes) {
    duration = `${hours}`;
  } else {
    duration = `${minutes}`;
  }
  return duration;
};

const getEventTimes = (from, to) => {
  const timeFrom = new Date(from);
  const timeFromToString = `${addLeadingZero(timeFrom.getHours())}:${addLeadingZero(timeFrom.getMinutes())}`;

  const timeTo = new Date(to);
  const timeToToString = `${addLeadingZero(timeTo.getHours())}:${addLeadingZero(timeTo.getMinutes())}`;

  const eventDurationString = getEventDuration(timeFrom, timeTo);

  return {
    dateFrom: timeFromToString,
    dateTo: timeToToString,
    duration: eventDurationString,
  };
};

const selectedOffersItemTemplate = (offer) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>
  `);
};

const selectedOffersTemplate = (offers) => {
  const offersList = offers.map((offer) => selectedOffersItemTemplate(offer)).join('\n');

  return (
    `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersList}
    </ul>
  `);
};

const eventsItemTemplate = (event) => {
  const times = getEventTimes(event.date_from, event.date_to);
  const selectedOffers = event.offers && event.offers.length > 0 ? selectedOffersTemplate(event.offers) : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.type} to ${event.destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${event.date_from}">${times.dateFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${event.date_to}">${times.dateTo}</time>
          </p>
          <p class="event__duration">${times.duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.base_price}</span>
        </p>

          ${selectedOffers}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

const eventsListTemplate = (events) => {
  const eventsList = events.map((event) => eventsItemTemplate(event)).join('\n');

  return (
    `<ul class="trip-events__list">
      ${eventsList}
    </ul>
    `);
};

const tripDayItemTemplate = (day, events, idx) => {
  const formatDay = day.split('.').reverse().join('-');
  const currentDate = new Date(formatDay);
  const dayNumber = currentDate.getDate();
  const month = MONTHS[currentDate.getMonth()];

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${idx + 1}</span>
        <time class="day__date" datetime="${formatDay}">${month} ${dayNumber}</time>
      </div>

      ${eventsListTemplate(events)}
    </li>
    `);
};

const tripDaysTemplate = (groupedPoints) => {
  const tripDays = Object.keys(groupedPoints).map((day, idx) => tripDayItemTemplate(day, groupedPoints[day], idx)).join('\n');

  return (
    `<ul class="trip-days">
      ${tripDays}
    </ul>
    `);
};

export const createTripDaysTemplate = (points) => {
  const groupedPoints = points.reduce((acc, cur) => {
    const currentDate = new Date(cur.date_from);
    if (acc[currentDate.toLocaleDateString()]) {
      acc[currentDate.toLocaleDateString()].push(cur);
    } else {
      acc[currentDate.toLocaleDateString()] = [];
      acc[currentDate.toLocaleDateString()].push(cur);
    }
    return acc;
  }, {});

  return (tripDaysTemplate(groupedPoints));
};
