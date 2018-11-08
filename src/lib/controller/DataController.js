import DateHelper from 'libs/helpers/DateHelper';
const HORIZON_BUFFER = 1000;
const HORIZON_BUFFER_ALERT = 750;

export default class DataController {
  constructor() {
    this.lower_limit = 0;
    this.upper_limit = 0;
    this._dataToRender = [];
  }

  initialize = (start, end, nowPosition, dayWidth) => {
    this.nowPosition = nowPosition;
    this.dayWidth = dayWidth;
    this.setLimits(start, end, nowPosition, dayWidth);
    this.loadDataHorizon();
  };

  // OnScroll
  setStartEnd = (start, end, nowPosition, dayWidth) => {
    this.nowPosition = nowPosition;
    this.dayWidth = dayWidth;
    if (this.needData(start, end)) {
      this.setLimits(start, end);
      this.loadDataHorizon();
    }
  };

  needData = (start, end) =>
    start < this.lower_data_limit || end > this.upper_data_limit;

  setLimits = (start, end) => {
    this.lower_limit = start - HORIZON_BUFFER;
    this.lower_data_limit = start - HORIZON_BUFFER_ALERT;
    this.upper_limit = end + HORIZON_BUFFER;
    this.upper_data_limit = end + HORIZON_BUFFER_ALERT;
  };

  // OnScroll
  loadDataHorizon = () => {
    const lowerLimit = DateHelper.pixelToDate(
      this.lower_limit,
      this.nowPosition,
      this.dayWidth,
    );
    const upLimit = DateHelper.pixelToDate(
      this.upper_limit,
      this.nowPosition,
      this.dayWidth,
    );
    this.onHorizonChange(lowerLimit, upLimit);
  };
}
