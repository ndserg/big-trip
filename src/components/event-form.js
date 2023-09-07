import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractSmartComponent from './abstract-smart-component';
import { getEventTimes, getPointTypeOffers } from '../utils/common';
import {
  OFFERS_TYPES,
  EVENT_TYPES,
  DatesRange,
  Mode,
} from '../const';

const getFormattedDate = (date) => {
  const currentDate = new Date(date);

  return currentDate.toLocaleDateString()
    .split('.')
    .reverse()
    .join('/')
    .slice(2);
};

const createEditModeTemplate = (isFavorite) => {
  const isChecked = isFavorite ? 'checked' : '';

  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isChecked}>
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

const createEventItemTemplate = (name, pointType) => {
  const isChecked = pointType === name ? 'checked' : '';

  return (
    `<div class="event__type-item">
      <input id="event-type-${name}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${name}" ${isChecked}>
      <label class="event__type-label event__type-label--${name}" for="event-type-${name}-1">${name}</label>
    </div>
    `);
};

const createEventTypeListTemplate = (pointType) => {
  const transferEvents = EVENT_TYPES.transfer.map((name) => createEventItemTemplate(name, pointType)).join('\n');
  const activityEvents = EVENT_TYPES.activity.map((name) => createEventItemTemplate(name, pointType)).join('\n');

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

const createOfferTemplate = (offer, offerName, isSelected) => {
  const { id, title, price } = offer;
  const offerTitle = OFFERS_TYPES[offerName][`id${id}`] || offerName;
  const isChecked = isSelected ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${offerTitle}-1" type="checkbox" name="event-offer-${offerTitle}" data-offer-id="${id}" ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offerTitle}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>
  `);
};

const createDestinationDescriptionTemplate = (destination) => {
  if (!destination.name) {
    return '';
  }

  const { description, pictures } = destination;

  const picturesTemplate = pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('\n');

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesTemplate}
        </div>
      </div>
    </section>
  `);
};

const createOffersContainerTemplate = (point, offers, destination, isAddingMode) => {
  const selectedOffers = [];
  let offersTemplate = '';

  point.offers.forEach((pointOffer) => {
    const selectedIdx = offers.findIndex((offer) => offer.id === pointOffer.id);
    if (selectedIdx !== -1) {
      selectedOffers.push(selectedIdx);
    }
  });

  const destinationTemplate = isAddingMode ? createDestinationDescriptionTemplate(destination) : '';

  offersTemplate = offers.map((offer, idx) => {
    const isSelected = selectedOffers.includes(idx);

    return createOfferTemplate(offer, point.type, isSelected);
  }).join('\n');

  return (
    `<section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offersTemplate}
        </div>
      </section>
        ${destinationTemplate}
    </section>
  `);
};

const createEventFormTemplate = (point, offers, destinations, mode) => {
  const isEditMode = mode === Mode.EDIT;
  const isAddingMode = mode === Mode.ADDING;

  const typePreposition = EVENT_TYPES.transfer.includes(point.type) ? 'to' : 'in';
  const dateFrom = getFormattedDate(point.date_from);
  const dateTo = getFormattedDate(point.date_to);
  const times = getEventTimes(point.date_from, point.date_to);

  const buttons = {
    save: 'Save',
    cancel: isEditMode ? 'Delete' : 'Cancel',
  };

  const editModeTemplate = isEditMode ? createEditModeTemplate(point.is_favorite) : '';

  const destinationsTemplate = destinations.map((destination) => createDestinationTemplate(destination.name)).join('\n');
  const eventTypeList = createEventTypeListTemplate(point.type);

  const offersTemplate = offers.length !== 0 ? createOffersContainerTemplate(point, offers, point.destination, isAddingMode) : '';

  return (
    `${isAddingMode
      ? `<form class="${isEditMode ? '' : 'trip-events__item '}event event--edit" action="#" method="post">`
      : `<li class="trip-events__item"><form class="${isEditMode ? '' : 'trip-events__item '}event event--edit" action="#" method="post">`}

        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            ${eventTypeList}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${point.type} ${typePreposition} ${point.destination.name}
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom} ${times.dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo} ${times.dateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;${point.base_price}
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">${buttons.save}</button>
          <button class="event__reset-btn" type="reset">${buttons.cancel}</button>

          ${editModeTemplate}
        </header>
          ${offersTemplate}

    ${isAddingMode ? '</form>' : '</form></li>'}
  `);
};

export default class EventForm extends AbstractSmartComponent {
  #point = null;
  #offers = null;
  #destinations = null;
  #mode = null;

  #currentPoint = null;
  #pointOffers = null;
  #selecetdDateFrom = null;
  #selecetdDateTo = null;
  #flatpickrDateFrom = null;
  #flatpickrDateTo = null;
  #buttonsClickHandler = null;

  constructor(point, offers, destinations, mode) {
    super();

    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#mode = mode || Mode.ADDING;

    this.#currentPoint = {
      id: point.id,
      type: point.type,
      destination: point.destination,
      date_from: point.date_from,
      date_to: point.date_to,
      base_price: point.base_price,
      offers: point.offers,
      is_favorite: point.is_favorite,
    };

    this.#pointOffers = getPointTypeOffers(this.#currentPoint.type, this.#offers);

    this.#selecetdDateFrom = this.#currentPoint.date_from;
    this.#selecetdDateTo = this.#currentPoint.date_to;

    this.subscribeOnEvents();
  }

  getTemplate() {
    return createEventFormTemplate(this.#currentPoint, this.#pointOffers.offers, this.#destinations, this.#mode);
  }

  recoveryListeners() {
    this.setButtonsClickHandler(this.#buttonsClickHandler);
    this.subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this.applyFlatpickr();
  }

  reset() {
    const point = this.#point;

    this.#currentPoint = {
      id: point.id,
      type: point.type,
      destination: point.destination,
      date_from: point.date_from,
      date_to: point.date_to,
      base_price: point.base_price,
      offers: point.offers,
      is_favorite: point.is_favorite,
    };

    this.rerender();
  }

  getData() {
    return this.#currentPoint;
  }

  #setSelectedDate = ([date], instance) => {
    switch (instance) {
      case DatesRange.date_from:
        this.#selecetdDateFrom = date;
        break;
      case DatesRange.date_to:
        this.#selecetdDateTo = date;
        break;
      default: // do nothing
    }
  };

  destroyFlatpickr() {
    this.#flatpickrDateFrom.destroy();
    this.#flatpickrDateTo.destroy();
    this.#flatpickrDateFrom = null;
    this.#flatpickrDateTo = null;
    document.querySelectorAll('.flatpickr-calendar').forEach((item) => item.remove());
  }

  applyFlatpickr() {
    if (this.#flatpickrDateFrom) {
      this.destroyFlatpickr();
    }

    const dateFromElement = this.getElement().querySelector('input[name="event-start-time"]');
    const dateToElement = this.getElement().querySelector('input[name="event-end-time"]');

    this.#flatpickrDateTo = flatpickr(dateToElement, {
      altInput: true,
      enableTime: true,
      time_24hr: true,
      dateFormat: 'd/m/y H:i',
      altFormat: 'd/m/y H:i',
      minDate: this.#selecetdDateFrom,
      defaultDate: this.#selecetdDateTo,
      onChange: (selectedDates) => {
        this.#setSelectedDate(selectedDates, DatesRange.date_to);
        this.#currentPoint.date_to = selectedDates[0].toISOString();
      },
    });

    this.#flatpickrDateFrom = flatpickr(dateFromElement, {
      altInput: true,
      enableTime: true,
      time_24hr: true,
      dateFormat: 'd/m/y H:i',
      altFormat: 'd/m/y H:i',
      defaultDate: this.#selecetdDateFrom,
      onChange: (selectedDates) => {
        this.#setSelectedDate(selectedDates, DatesRange.date_from);
        this.#flatpickrDateTo.set('minDate', this.#selecetdDateFrom);
        this.#currentPoint.date_from = selectedDates[0].toISOString();
      },
    });
  }

  subscribeOnEvents() {
    const element = this.getElement();
    const destinationsInput = element.querySelector('.event__input--destination');
    const priceInput = element.querySelector('.event__input--price');
    const offersContainer = element.querySelector('.event__available-offers');
    const eventTypesContainer = element.querySelector('.event__type-wrapper');
    const eventTypeToggleButton = eventTypesContainer.querySelector('.event__type-btn');
    const eventTypeToggleInput = eventTypesContainer.querySelector('.event__type-toggle');

    const getCheckedOffers = (offersElement) => {
      const parent = offersElement.parentElement;
      const selectedInputs = parent.querySelectorAll('input:checked');
      const selectedIds = Array.from(selectedInputs).map((input) => input.dataset.offerId);

      const selectedOffers = [];

      selectedIds.forEach((offerId) => {
        this.#pointOffers.offers.forEach((offer) => {
          if (offer.id === offerId) {
            selectedOffers.push(offer);
          }
        });
      });

      return selectedOffers;
    };

    eventTypesContainer.addEventListener('click', (evt) => {
      if (evt.target === eventTypeToggleButton || evt.target.closest('LABEL') === eventTypeToggleButton) {
        eventTypeToggleInput.checked = !eventTypeToggleInput.checked;
      }

      if (evt.target.classList?.contains('.event__type-label') === eventTypeToggleButton || evt.target.closest('.event__type-label')) {
        this.#currentPoint.type = evt.target.parentElement.querySelector('INPUT').value;
        this.#pointOffers = getPointTypeOffers(this.#currentPoint.type, this.#offers);
        if (this.#currentPoint.type === this.#point.type) {
          this.#currentPoint.offers = this.#point.offers;
        } else {
          this.#currentPoint.offers = [];
        }
        eventTypeToggleButton.querySelector('img').src = `img/icons/${this.#currentPoint.type}.png`;
        eventTypeToggleInput.checked = !eventTypeToggleInput.checked;

        this.rerender();
      }
    });

    destinationsInput.addEventListener('change', (evt) => {
      const destination = this.#destinations.find((item) => item.name === evt.target.value);
      this.#currentPoint.destination = destination;
      this.rerender();
    });

    priceInput.addEventListener('change', (evt) => {
      this.#currentPoint.base_price = Number(evt.target.value);
      this.rerender();
    });

    if (offersContainer) {
      offersContainer.addEventListener('click', (evt) => {
        const offersElement = evt.target.closest('.event__offer-selector') ? evt.target.closest('.event__offer-selector') : null;
        if (offersElement) {
          const input = offersElement.querySelector('INPUT');
          input.checked = !input.checked;
        }

        this.#currentPoint.offers = getCheckedOffers(offersElement);
        this.rerender();
      });
    }
  }

  setButtonsClickHandler(handler) {
    this.getElement().addEventListener('click', handler);
    this.#buttonsClickHandler = handler;
  }
}
