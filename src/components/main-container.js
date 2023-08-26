import AbstractComponent from './abstract-component';

const createMainContainerTemplate = () => {
  return (
    `<div class="page-body__container"></div>
    `);
};

export default class MainContainer extends AbstractComponent {
  getTemplate() {
    return createMainContainerTemplate();
  }
}
