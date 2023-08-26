export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    default:
    // do nothing
  }
};

export const getGroupedPoints = (points) => points.reduce((acc, cur) => {
  const currentDate = new Date(cur.date_from);
  if (acc[currentDate.toLocaleDateString()]) {
    acc[currentDate.toLocaleDateString()].push(cur);
  } else {
    acc[currentDate.toLocaleDateString()] = [];
    acc[currentDate.toLocaleDateString()].push(cur);
  }
  return acc;
}, {});

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
