import TripController from './controllers/TripController';
import MainContainer from './components/main-container';
import TripTabsComponent from './components/trip-tabs';
import TripFiltersComponent from './components/trip-filters';
import LoadingComponent from './components/loading';
import { TABS, FLITER_TYPES } from './const';
import { render, RenderPosition } from './utils/utils';

import { getPoints, getOffers, getDestinations } from './components/api-service';

const tripMainContainer = document.querySelector('.trip-main');
const tripControlsContainer = tripMainContainer.querySelector('.trip-controls');
const pageMain = document.querySelector('.page-main');
const mainContainerComponent = new MainContainer();
const tripController = new TripController(mainContainerComponent);

render(tripControlsContainer, new TripTabsComponent(TABS), RenderPosition.AFTERBEGIN);
render(tripControlsContainer, new TripFiltersComponent(FLITER_TYPES), RenderPosition.BEFOREEND);

render(pageMain, mainContainerComponent, RenderPosition.AFTERBEGIN);
render(mainContainerComponent.getElement(), new LoadingComponent(), RenderPosition.BEFOREEND);

const loadData = () => {
  const loadPoints = getPoints().then((values) => values);

  const loadOffers = getOffers().then((values) => values);

  const loadDestinations = getDestinations().then((values) => values);

  Promise.all([loadPoints, loadOffers, loadDestinations]).then((values) => {
    const [points, offers, destinations] = values;
    localStorage.data = JSON.stringify({ points, offers, destinations });

    tripController.render({ points, offers, destinations });
  });
};

if (localStorage.data) {
  tripController.render(JSON.parse(localStorage.data));
} else {
  loadData();
}
