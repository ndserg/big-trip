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
import API from './services/api-service';

const AUTHORIZATION = 'Basic u4mtv8m3498tmiemgbe74';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const pointsModel = new PointsModel();

const api = new API(END_POINT, AUTHORIZATION, pointsModel);

let activeTab = Tabs.TABLE;

const pageMain = document.querySelector('.page-main');
const tripMainContainer = document.querySelector('.trip-main');
const tripControlsContainer = tripMainContainer.querySelector('.trip-controls');

const mainContainerComponent = new MainContainer();
const loadingComponent = new LoadingComponent();
const filterController = new FilterController(tripControlsContainer, pointsModel);
const tripTabsComponent = new TripTabsComponent(Tabs, activeTab);
const addPointButtonComponent = new AddPointButtonComponent();
const statisticsComponent = new StatisticsComponent(pointsModel);
const tripController = new TripController(mainContainerComponent, pointsModel, api);

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
  const currentTab = activeTab;
  statisticsComponent.hide();
  activeTab = Tabs.TABLE;
  switchTabs(currentTab);
};

pointsModel.setFilterChangeHandler(onFiltersChange);

tripTabsComponent.setTabsChangeHandler((newActiveTab) => {
  switchTabs(newActiveTab);
});

const initApp = (points, offers, destinations) => {
  pointsModel.points = points;
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

api.getData()
  .then(({ points, offers, destinations }) => {
    initApp(points, offers, destinations);
  });
