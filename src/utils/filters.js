import { FilterType } from '../const';

export default (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return points.filter((point) => new Date(point.date_from) > new Date());
    case FilterType.PAST:
      return points.filter((point) => new Date(point.date_to) < new Date());
    default:
      return points;
  }
};
