import { createTripInfoTemplate } from './components/trip-info';
import { createTripTabsTemplate } from './components/trip-tabs';
import { createTripFiltersTemplate } from './components/trip-filters';
import { createTripSortTemplate } from './components/trip-sort';
import { createTripDaysTemplate } from './components/trip-days';
import { createEventFormTemplate } from './components/event-form';
import { createLoadingTemplate } from './components/loading';
import { RENDER_POSITIONS } from './const';

import { getPoints, getOffers, getDestinations } from './components/api-service';

const tripMainContainer = document.querySelector('.trip-main');
const tripControlsContainer = tripMainContainer.querySelector('.trip-controls');
const tripEventsContainer = document.querySelector('.trip-events');

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

render(tripEventsContainer, createLoadingTemplate(), RENDER_POSITIONS.beforeend);

const initApp = ({ points, offers, destinations }) => {
  tripEventsContainer.querySelector('.trip-events__msg').remove();

  render(tripMainContainer, createTripInfoTemplate(points), RENDER_POSITIONS.afterbegin);
  render(tripControlsContainer, createTripTabsTemplate(), RENDER_POSITIONS.afterbegin);
  render(tripControlsContainer, createTripFiltersTemplate(), RENDER_POSITIONS.beforeend);
  render(tripEventsContainer, createTripSortTemplate(), RENDER_POSITIONS.beforeend);
  render(tripEventsContainer, createEventFormTemplate(offers, destinations), RENDER_POSITIONS.beforeend);
  render(tripEventsContainer, createTripDaysTemplate(points), RENDER_POSITIONS.beforeend);
};

const loadData = () => {
  const loadPoints = getPoints().then((values) => values);

  const loadOffers = getOffers().then((values) => values);

  const loadDestinations = getDestinations().then((values) => values);

  Promise.all([loadPoints, loadOffers, loadDestinations]).then((values) => {
    const [points, offers, destinations] = values;
    localStorage.data = JSON.stringify({ points, offers, destinations });

    initApp({ points, offers, destinations });
  });
};

if (localStorage.data) {
  initApp(JSON.parse(localStorage.data));
} else {
  loadData();
}
