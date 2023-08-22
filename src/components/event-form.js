import { EVENT_TYPES, OFFERS_TYPES } from '../const';

const createEventItemTemplate = (name) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}">
      <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-1">${name}</label>
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
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle}-1" type="checkbox" name="event-offer-${offerTitle}">
      <label class="event__offer-label" for="event-offer-${offerTitle}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>
  `);
};

export const createEventFormTemplate = (allOffers, destinations) => {
  const transferEvents = EVENT_TYPES.transfer.map((name) => createEventItemTemplate(name)).join('\n');
  const activityEvents = EVENT_TYPES.activity.map((name) => createEventItemTemplate(name)).join('\n');
  const destinationsTemplate = destinations.map((destination) => createDestinationTemplate(destination.name)).join('\n');

  const currentOffers = allOffers.find((item) => {
    return item.type === EVENT_TYPES.transfer[0];
  });

  const offersTemplate = currentOffers.offers.map((offer) => createOfferTemplate(offer, EVENT_TYPES.transfer[0])).join('\n');

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              ${transferEvents}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              ${activityEvents}
            </fieldset>
          </div>
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

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
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
