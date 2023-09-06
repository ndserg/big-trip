import PointsModel from './models/points';
import TripController from './controllers/TripController';
import FilterController from './controllers/FilterController';
import MainContainer from './components/main-container';
import TripTabsComponent from './components/trip-tabs';
import LoadingComponent from './components/loading';
import StatisticsComponent from './components/statistics';
import AddPointButtonComponent from './components/add-point-button';
import { Tabs } from './const';
import { render, RenderPosition } from './utils/render';
import { transformRawToPoint } from './utils/common';
import { getPoints, getOffers, getDestinations } from './components/api-service';

let activeTab = Tabs.TABLE;

const pageMain = document.querySelector('.page-main');
const tripMainContainer = document.querySelector('.trip-main');
const tripControlsContainer = tripMainContainer.querySelector('.trip-controls');

const mainContainerComponent = new MainContainer();
const loadingComponent = new LoadingComponent();
const pointsModel = new PointsModel();
const filterController = new FilterController(tripControlsContainer, pointsModel);
const tripTabsComponent = new TripTabsComponent(Tabs, activeTab);
const addPointButtonComponent = new AddPointButtonComponent();
const statisticsComponent = new StatisticsComponent(pointsModel);
const tripController = new TripController(mainContainerComponent, pointsModel);

const mainContainerElement = mainContainerComponent.getElement();

render(tripMainContainer, addPointButtonComponent, RenderPosition.BEFOREEND);
render(tripControlsContainer, tripTabsComponent, RenderPosition.AFTERBEGIN);
filterController.render();

render(pageMain, mainContainerComponent, RenderPosition.AFTERBEGIN);
render(mainContainerElement, loadingComponent, RenderPosition.BEFOREEND);

const switchTabs = (newActiveTab) => {
  if (newActiveTab === activeTab) {
    return;
  }

  activeTab = newActiveTab;
  tripTabsComponent.activeTab = activeTab;

  if (newActiveTab === Tabs.TABLE) {
    addPointButtonComponent.getElement().disabled = false;
    tripController.show();
    statisticsComponent.hide();
  } else if (newActiveTab === Tabs.STATS) {
    addPointButtonComponent.getElement().disabled = true;
    tripController.hide();
    statisticsComponent.show();
  }
};

const onFiltersChange = () => {
  switchTabs(Tabs.TABLE);
};

pointsModel.setFilterChangeHandler(onFiltersChange);

tripTabsComponent.setTabsChangeHandler((newActiveTab) => {
  switchTabs(newActiveTab);
});

const initApp = (points, offers, destinations) => {
  pointsModel.points = transformRawToPoint(points, offers, destinations);
  pointsModel.offers = offers;
  pointsModel.destinations = destinations;

  loadingComponent.getElement().remove();
  loadingComponent.removeElement();

  tripController.render();

  render(mainContainerElement, statisticsComponent, RenderPosition.BEFOREEND);

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
