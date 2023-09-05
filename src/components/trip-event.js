import AbstractComponent from './abstract-component';
import { getEventTimes } from '../utils/common';
import { EVENT_TYPES } from '../const';

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

const createTripEventTemplate = (event) => {
  const times = getEventTimes(event.date_from, event.date_to);
  const selectedOffers = event.offers && event.offers.length > 0 ? selectedOffersTemplate(event.offers) : '';
  const evenTypePreposition = EVENT_TYPES.transfer.includes(event.type) ? 'to' : 'in';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.type} ${evenTypePreposition} ${event.destination.name}</h3>

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

export default class TripEvent extends AbstractComponent {
  #event;

  #rollupButtonClickHandler;

  constructor(event) {
    super();

    this.#event = event;

    this.#rollupButtonClickHandler = null;
  }

  getTemplate() {
    return createTripEventTemplate(this.#event);
  }

  recoveryListeners() {
    this.setRollupButtonClickHandler(this.#rollupButtonClickHandler);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', handler);
    this.#rollupButtonClickHandler = handler;
  }
}
