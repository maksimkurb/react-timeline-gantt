import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  VIEW_MODE_DAY,
  VIEW_MODE_WEEK,
  VIEW_MODE_MONTH,
  VIEW_MODE_YEAR,
  BUFFER_DAYS,
  DATA_CONTAINER_WIDTH,
} from 'libs/Const';
import Config from 'libs/helpers/config/Config';
import DateHelper from 'libs/helpers/DateHelper';
import './Header.css';

export class HeaderItem extends PureComponent {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderLeft: 'solid 1px white',
          position: 'absolute',
          height: 20,
          left: this.props.left,
          width: this.props.width,
        }}
      >
        <div>{this.props.label}</div>
      </div>
    );
  }
}

export default class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.setBoundaries();
  }

  getFormat(mode, position) {
    switch (mode) {
      case 'year':
        return 'YYYY';
      case 'month':
        if (position === 'top') return 'MMMM YYYY';
        return 'MMMM';
      case 'week':
        if (position === 'top') return 'ww MMMM YYYY';
        return 'ww';
      case 'dayweek':
        return 'dd';
      case 'daymonth':
        return 'D';
      default:
        return '';
    }
  }

  getModeIncrement(date, mode) {
    switch (mode) {
      case 'year':
        return DateHelper.daysInYear(date.year());
      case 'month':
        return date.daysInMonth();
      case 'week':
        return 7;
      default:
        return 1;
    }
  }

  getStartDate = (date, mode) => {
    switch (mode) {
      case 'year':
        return moment([date.year(), 0, 1]);
      case 'month':
        return moment([date.year(), date.month(), 1]);
      case 'week':
        return date.subtract(date.day(), 'days');
      default:
        return date;
    }
  };

  renderTime = (left, width, mode, key) => {
    const result = [];
    const hourWidth = width / 24;
    let iterLeft = 0;
    for (let i = 0; i < 24; i++) {
      result.push(
        <HeaderItem
          key={i}
          left={iterLeft}
          width={hourWidth}
          label={mode === 'shorttime' ? i : `${i}:00`}
        />,
      );
      iterLeft += hourWidth;
    }
    return (
      <div key={key} style={{ position: 'absolute', height: 20, left, width }}>
        {' '}
        {result}
      </div>
    );
  };

  getBox(date, mode, lastLeft) {
    const increment = this.getModeIncrement(date, mode) * this.props.dayWidth;
    let left = lastLeft;
    if (!left) {
      let starDate = this.getStartDate(date, mode);
      starDate = starDate.startOf('day');
      const now = moment().startOf('day');
      const daysInBetween = starDate.diff(now, 'days');
      left = DateHelper.dayToPosition(
        daysInBetween,
        this.props.nowPosition,
        this.props.dayWidth,
      );
    }

    return { left, width: increment };
  }

  renderHeaderRows = (top, middle, bottom) => {
    const result = { top: [], middle: [], bottom: [] };
    const lastLeft = {};
    let currentTop = '';
    let currentMiddle = '';
    let currentBottom = '';
    let currentDate = null;
    let box = null;

    const start = this.props.currentday;
    const end = this.props.currentday + this.props.numVisibleDays;

    for (let i = start - BUFFER_DAYS; i < end + BUFFER_DAYS; i++) {
      // The unit of iteration is day
      currentDate = moment().add(i, 'days');
      if (currentTop !== currentDate.format(this.getFormat(top, 'top'))) {
        currentTop = currentDate.format(this.getFormat(top, 'top'));
        box = this.getBox(currentDate, top, lastLeft.top);
        lastLeft.top = box.left + box.width;
        result.top.push(
          <HeaderItem
            key={i}
            left={box.left}
            width={box.width}
            label={currentTop}
          />,
        );
      }

      if (currentMiddle !== currentDate.format(this.getFormat(middle))) {
        currentMiddle = currentDate.format(this.getFormat(middle));
        box = this.getBox(currentDate, middle, lastLeft.middle);
        lastLeft.middle = box.left + box.width;
        result.middle.push(
          <HeaderItem
            key={i}
            left={box.left}
            width={box.width}
            label={currentMiddle}
          />,
        );
      }

      if (currentBottom !== currentDate.format(this.getFormat(bottom))) {
        currentBottom = currentDate.format(this.getFormat(bottom));
        box = this.getBox(currentDate, bottom, lastLeft.bottom);
        lastLeft.bottom = box.left + box.width;
        if (bottom === 'shorttime' || bottom === 'fulltime') {
          result.bottom.push(this.renderTime(box.left, box.width, bottom, i));
        } else {
          result.bottom.push(
            <HeaderItem
              key={i}
              left={box.left}
              width={box.width}
              label={currentBottom}
            />,
          );
        }
      }
    }

    return (
      <div
        className="timeLine-main-header-container"
        style={{ width: DATA_CONTAINER_WIDTH, maxWidth: DATA_CONTAINER_WIDTH }}
      >
        <div
          className="header-top"
          style={{ ...Config.values.header.top.style }}
        >
          {result.top}
        </div>
        <div
          className="header-middle"
          style={{ ...Config.values.header.middle.style }}
        >
          {result.middle}
        </div>
        <div
          className="header-bottom"
          style={{ ...Config.values.header.bottom.style }}
        >
          {result.bottom}
        </div>
      </div>
    );
  };

  renderHeader = () => {
    switch (this.props.mode) {
      case VIEW_MODE_DAY:
        return this.renderHeaderRows('week', 'dayweek', 'fulltime');
      case VIEW_MODE_WEEK:
        return this.renderHeaderRows('week', 'dayweek', 'shorttime');
      case VIEW_MODE_MONTH:
        return this.renderHeaderRows('month', 'dayweek', 'daymonth');
      case VIEW_MODE_YEAR:
        return this.renderHeaderRows('year', 'month', 'week');
      default:
        return null;
    }
  };

  setBoundaries = () => {
    this.start = this.props.currentday - BUFFER_DAYS;
    this.end = this.props.currentday + this.props.numVisibleDays + BUFFER_DAYS;
  };

  needToRender = () =>
    this.props.currentday < this.start ||
    this.props.currentday + this.props.numVisibleDays > this.end;

  render() {
    if (this.header) this.header.scrollLeft = this.props.scrollLeft;
    // Check boundaries to see if wee need to recalculate header
    // if (this.needToRender()|| !this.cache){
    //     this.cache=this.renderHeader();
    //     this.setBoundaries();
    // }
    return (
      <div
        id="timeline-header"
        ref={r => {
          this.header = r;
        }}
        className="timeLine-main-header-viewPort"
      >
        {this.renderHeader()}
      </div>
    );
  }
}
