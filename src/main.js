import PointsModel from './models/points';
import TripController from './controllers/TripController';
import FilterController from './controllers/FilterController';
import MainContainer from './components/main-container';
import TripTabsComponent from './components/trip-tabs';
import LoadingComponent from './components/loading';
import AddPointButtonComponent from './components/add-point-button';
import { TABS } from './const';
import { render, RenderPosition } from './utils/render';
import { transformRawToPoint } from './utils/common';
import { getPoints, getOffers, getDestinations } from './components/api-service';

const pageMain = document.querySelector('.page-main');
const tripMainContainer = document.querySelector('.trip-main');
const tripControlsContainer = tripMainContainer.querySelector('.trip-controls');

const mainContainerComponent = new MainContainer();
const loadingComponent = new LoadingComponent();
const pointsModel = new PointsModel();
const filterController = new FilterController(tripControlsContainer, pointsModel);
const tripTabsComponent = new TripTabsComponent(TABS);
const addPointButtonComponent = new AddPointButtonComponent();

const mainContainerElement = mainContainerComponent.getElement();

render(tripMainContainer, addPointButtonComponent, RenderPosition.BEFOREEND);
render(tripControlsContainer, tripTabsComponent, RenderPosition.AFTERBEGIN);
filterController.render();

render(pageMain, mainContainerComponent, RenderPosition.AFTERBEGIN);
render(mainContainerElement, loadingComponent, RenderPosition.BEFOREEND);

const initApp = (points, offers, destinations) => {
  pointsModel.points = transformRawToPoint(points, offers, destinations);
  pointsModel.offers = offers;
  pointsModel.destinations = destinations;

  const tripController = new TripController(mainContainerComponent, pointsModel);

  loadingComponent.getElement().remove();
  loadingComponent.removeElement();

  tripController.render();

  addPointButtonComponent.setAddButtonClickHandler((evt) => {
    tripController.createPoint(evt.target);
  });
};

const loadData = () => {
  const loadPoints = getPoints().then((values) => values);

  const loadOffers = getOffers().then((values) => values);

  const loadDestinations = getDestinations().then((values) => values);

  Promise.all([loadPoints, loadOffers, loadDestinations]).then((values) => {
    const [points, offers, destinations] = values;
    localStorage.points = JSON.stringify(points);
    localStorage.offers = JSON.stringify(offers);
    localStorage.destinations = JSON.stringify(destinations);

    initApp(points, offers, destinations);
  });
};

if (localStorage.points && localStorage.offers && localStorage.destinations) {
  initApp(JSON.parse(localStorage.points), JSON.parse(localStorage.offers), JSON.parse(localStorage.destinations));
} else {
  loadData();
}
