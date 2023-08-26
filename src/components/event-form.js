import { createElement } from '../utils/utils';
import { OFFERS_TYPES, EVENT_TYPES } from '../const';

const createEditModeTemplate = () => {
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
    `);
};

const createEventItemTemplate = (name) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${name}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${name}">
      <label class="event__type-label event__type-label--${name}" for="event-type-${name}-1">${name}</label>
    </div>
    `);
};

const createEventTypeListTemplate = () => {
  const transferEvents = EVENT_TYPES.transfer.map((name) => createEventItemTemplate(name)).join('\n');
  const activityEvents = EVENT_TYPES.activity.map((name) => createEventItemTemplate(name)).join('\n');

  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Transfer</legend>

        ${transferEvents}
      </fieldset>

      <fieldset class="event__type-group">
        <legend class="visually-hidden">Activity</legend>

        ${activityEvents}
      </fieldset>
    </div>
    `);
};

const createDestinationTemplate = (name) => {
  return (`<option value="${name}"></option>`);
};

const createOfferTemplate = (offer, offerName) => {
  const { id, title, price } = offer;
  const offerTitle = OFFERS_TYPES[offerName][`id${id}`] || offerName;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${offerTitle}-1" type="checkbox" name="event-offer-${offerTitle}">
      <label class="event__offer-label" for="event-offer-${offerTitle}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>
  `);
};

const createEventFormTemplate = (allOffers, destinations, mode) => {
  const isEditMode = mode === 'edit';
  const buttons = {
    save: 'Save',
    cancel: isEditMode ? 'Delete' : 'Cancel',
  };

  const editModeTemplate = isEditMode ? createEditModeTemplate() : '';

  const destinationsTemplate = destinations.map((destination) => createDestinationTemplate(destination.name)).join('\n');
  const eventTypeList = createEventTypeListTemplate();

  const currentOffers = allOffers.find((item) => {
    return item.type === EVENT_TYPES.transfer[0];
  });

  const offersTemplate = currentOffers.offers.map((offer) => createOfferTemplate(offer, EVENT_TYPES.transfer[0])).join('\n');

  return (
    `<form class="${isEditMode ? '' : 'trip-events__item '}event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          ${eventTypeList}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            Flight to
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">${buttons.save}</button>
        <button class="event__reset-btn" type="reset">${buttons.cancel}</button>

        ${editModeTemplate}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersTemplate}
          </div>
        </section>
      </section>
    </form>
  `);
};

export default class EventForm {
  #element = null;

  #offers = null;

  #destinations = null;

  #mode;

  constructor(offers, destinations, mode) {
    this.#element = null;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#mode = mode || 'add';
  }

  getTemplate() {
    return createEventFormTemplate(this.#offers, this.#destinations, this.#mode);
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
