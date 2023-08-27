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

export const remove = (element) => {
  element.remove();
};

export const replace = (parent, newElement, oldElement) => {
  parent.replaceChild(newElement, oldElement);
};

export const getGroupedPoints = (points) => {
  let dayIdx = 0;
  let currentDate = '';
  const groupedPoints = [];

  points.slice().forEach((point) => {
    const currentPointDate = new Date(point.date_from);
    if (currentPointDate.toLocaleDateString() === currentDate) {
      groupedPoints[dayIdx - 1].push(point);
    } else {
      currentDate = currentPointDate.toLocaleDateString();
      groupedPoints.push([point]);
      dayIdx += 1;
    }
  });

  return groupedPoints;
};

export const addLeadingZero = (num) => {
  return num < 10 ? `0${num}` : num;
};

export const getEventDuration = (from, to) => {
  let duration = '';
  const eventDurationHours = Math.floor(((to - from) / 60000) / 60);
  const eventDurationMinutes = Math.round(((to - from) / 60000) % 60);

  const hours = eventDurationHours === 0 ? '' : `${eventDurationHours}H`;
  const minutes = eventDurationMinutes === 0 ? '' : `${eventDurationMinutes}M`;
  if (hours && minutes) {
    duration = `${hours} ${minutes}`;
  } else if (hours && !minutes) {
    duration = `${hours}`;
  } else {
    duration = `${minutes}`;
  }
  return duration;
};

export const getEventTimes = (from, to) => {
  const timeFrom = new Date(from);
  const timeFromToString = `${addLeadingZero(timeFrom.getHours())}:${addLeadingZero(timeFrom.getMinutes())}`;

  const timeTo = new Date(to);
  const timeToToString = `${addLeadingZero(timeTo.getHours())}:${addLeadingZero(timeTo.getMinutes())}`;

  const eventDurationString = getEventDuration(timeFrom, timeTo);

  return {
    dateFrom: timeFromToString,
    dateTo: timeToToString,
    duration: eventDurationString,
  };
};
