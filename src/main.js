import MainContainer from './components/main-container';
import TripEventsComponent from './components/trip-events';
import TripDayEventsComponent from './components/trip-day-events';
import TripEventComponent from './components/trip-event';
import TripInfoComponent from './components/trip-info';
import TripTabsComponent from './components/trip-tabs';
import TripFiltersComponent from './components/trip-filters';
import TripSortComponent from './components/trip-sort';
import TripDaysComponent from './components/trip-days';
import TripDayComponent from './components/trip-day';
import EventFormComponent from './components/event-form';
import LoadingComponent from './components/loading';
import { TABS, SORT_EVENTS, FLITER_TYPES } from './const';
import {
  getGroupedPoints,
  render,
  remove,
  replace,
  RenderPosition,
} from './utils/utils';

import { getPoints, getOffers, getDestinations } from './components/api-service';

const tripMainContainer = document.querySelector('.trip-main');
const tripControlsContainer = tripMainContainer.querySelector('.trip-controls');
const pageMain = document.querySelector('.page-main');
const eventsComponent = new TripEventsComponent();
const mainContainerComponent = new MainContainer();

render(pageMain, mainContainerComponent, RenderPosition.AFTERBEGIN);
render(mainContainerComponent.getElement(), new LoadingComponent(), RenderPosition.BEFOREEND);

const renderEvent = (dayElement, events, offers, destinations) => {
  const eventComponent = new TripEventComponent(events);
  const editDayComponent = new EventFormComponent(offers, destinations, 'edit');
  render(dayElement, eventComponent, RenderPosition.BEFOREEND);

  eventComponent.setClickHandler(() => {
    replace(dayElement, editDayComponent.getElement(), eventComponent.getElement());
  });

  editDayComponent.setClickHandler((evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('event__save-btn') || evt.target.classList.contains('event__reset-btn') || evt.target.classList.contains('event__rollup-btn')) {
      replace(dayElement, eventComponent.getElement(), editDayComponent.getElement());
    }
  });
};

const renderDay = (tripDaysListElement, day, events, idx, offers, destinations) => {
  const dayComponent = new TripDayComponent(day, idx);
  const tripDayEventsComponent = new TripDayEventsComponent();

  render(tripDaysListElement, dayComponent, RenderPosition.BEFOREEND);
  events.forEach((event) => {
    renderEvent(tripDayEventsComponent.getElement(), event, offers, destinations);
  });
  render(dayComponent.getElement(), tripDayEventsComponent, RenderPosition.BEFOREEND);
};

const initApp = ({ points, offers, destinations }) => {
  const tripDaysComponent = new TripDaysComponent();
  const groupedPoints = getGroupedPoints(points);
  Object.keys(groupedPoints).map((day, idx) => renderDay(tripDaysComponent.getElement(), day, groupedPoints[day], idx, offers, destinations));

  remove(mainContainerComponent.getElement().querySelector('.trip-events__msg'));

  render(tripMainContainer, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);
  render(tripControlsContainer, new TripTabsComponent(TABS), RenderPosition.AFTERBEGIN);
  render(tripControlsContainer, new TripFiltersComponent(FLITER_TYPES), RenderPosition.BEFOREEND);
  render(mainContainerComponent.getElement(), eventsComponent, RenderPosition.AFTERBEGIN);
  render(eventsComponent.getElement(), new TripSortComponent(SORT_EVENTS), RenderPosition.BEFOREEND);
  render(eventsComponent.getElement(), tripDaysComponent, RenderPosition.BEFOREEND);
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
