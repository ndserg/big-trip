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
import { getGroupedPoints, render, RenderPosition } from './utils/utils';
import { TABS, SORT_EVENTS, FLITER_TYPES } from './const';

import { getPoints, getOffers, getDestinations } from './components/api-service';

const tripMainContainer = document.querySelector('.trip-main');
const tripControlsContainer = tripMainContainer.querySelector('.trip-controls');
const tripEventsContainer = document.querySelector('.page-main .page-body__container');
const eventsComponent = new TripEventsComponent();

render(tripEventsContainer, new LoadingComponent().getElement(), RenderPosition.BEFOREEND);

const renderEvent = (dayElement, events, offers, destinations) => {
  const eventComponent = new TripEventComponent(events);
  const editDayComponent = new EventFormComponent(offers, destinations, 'edit');
  render(dayElement, eventComponent.getElement(), RenderPosition.BEFOREEND);

  const openEventButtonClickHandler = () => {
    dayElement.replaceChild(editDayComponent.getElement(), eventComponent.getElement());
  };

  const openEventButton = eventComponent.getElement().querySelector('.event__rollup-btn');
  openEventButton.addEventListener('click', openEventButtonClickHandler);

  const editDayComponentSubmitHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('event__save-btn') || evt.target.classList.contains('event__reset-btn') || evt.target.classList.contains('event__rollup-btn')) {
      dayElement.replaceChild(eventComponent.getElement(), editDayComponent.getElement());
    }
  };

  editDayComponent.getElement().addEventListener('click', editDayComponentSubmitHandler);
};

const renderDay = (tripDaysListElement, day, events, idx, offers, destinations) => {
  const dayComponent = new TripDayComponent(day, idx);
  const tripDayEventsComponent = new TripDayEventsComponent();

  render(tripDaysListElement, dayComponent.getElement(), RenderPosition.BEFOREEND);
  events.forEach((event) => {
    renderEvent(tripDayEventsComponent.getElement(), event, offers, destinations);
  });
  render(dayComponent.getElement(), tripDayEventsComponent.getElement(), RenderPosition.BEFOREEND);
};

const initApp = ({ points, offers, destinations }) => {
  const tripDaysListElement = new TripDaysComponent().getElement();
  const groupedPoints = getGroupedPoints(points);
  Object.keys(groupedPoints).map((day, idx) => renderDay(tripDaysListElement, day, groupedPoints[day], idx, offers, destinations));

  tripEventsContainer.querySelector('.trip-events__msg').remove();

  render(tripMainContainer, new TripInfoComponent(points).getElement(), RenderPosition.AFTERBEGIN);
  render(tripControlsContainer, new TripTabsComponent(TABS).getElement(), RenderPosition.AFTERBEGIN);
  render(tripControlsContainer, new TripFiltersComponent(FLITER_TYPES).getElement(), RenderPosition.BEFOREEND);
  render(tripEventsContainer, eventsComponent.getElement(), RenderPosition.AFTERBEGIN);
  render(eventsComponent.getElement(), new TripSortComponent(SORT_EVENTS).getElement(), RenderPosition.BEFOREEND);
  render(eventsComponent.getElement(), tripDaysListElement, RenderPosition.BEFOREEND);
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
