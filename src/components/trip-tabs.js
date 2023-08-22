import { TABS } from '../const';

const createTripTabItemTemplate = (name, idx) => {
  const isActive = idx === 0 ? 'trip-tabs__btn--active' : '';

  return (`<a class="trip-tabs__btn  ${isActive}" href="#">${name}</a>`);
};

export const createTripTabsTemplate = () => {
  const tripTabs = TABS.map((tabName, idx) => createTripTabItemTemplate(tabName, idx)).join('\n');

  return (
    `<h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${tripTabs}
    </nav>
  `);
};
