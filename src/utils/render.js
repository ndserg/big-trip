export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    default:
    // do nothing
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replace = (newComponent, oldComponent) => {
  const oldElement = oldComponent.getElement();
  const newElement = newComponent.getElement();
  const { parentElement } = oldElement;

  const isExistElements = !!(parentElement && oldElement && newElement);

  if (isExistElements) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
