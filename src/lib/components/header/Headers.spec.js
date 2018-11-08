import React from 'react';
import DateHelper from 'libs/helpers/DateHelper';
import { BUFFER_DAYS } from 'libs/Const';
import {
  VIEW_MODE_DAY,
  VIEW_MODE_WEEK,
  VIEW_MODE_MONTH,
  VIEW_MODE_YEAR,
} from 'libs/Const';
import moment from 'moment';
import { shallow, mount } from 'enzyme';
import Headers from './Headers';

describe('Header Init ', () => {
  it('It mount properly when no property is given', () => {
    const wrapper = shallow(<Headers />);
    expect(wrapper.find('.header-top').children()).toHaveLength(0);
    expect(wrapper.find('.header-middle').children()).toHaveLength(0);
    expect(wrapper.find('.header-bottom').children()).toHaveLength(0);
  });

  it('When mode is year it draws correctly', () => {
    // calculateMonthData(start,end,now,dayWidth)
    const now = 0;
    const dayWidth = 30;
    const wrapper = shallow(
      <Headers
        numVisibleDays={30}
        currentday={0}
        nowposition={now}
        dayWidth={dayWidth}
        mode={VIEW_MODE_YEAR}
        scrollLeft={0}
      />,
    );
    const startDate = moment().add(-BUFFER_DAYS, 'days');
    const endDate = moment().add(30 + BUFFER_DAYS, 'days');
    const years = endDate.year() - startDate.year() + 1;
    expect(wrapper.find('.header-top').children()).toHaveLength(years);
    const months = Math.ceil(endDate.diff(startDate, 'months', true)) + 1;
    expect(wrapper.find('.header-middle').children()).toHaveLength(months);
    const weeks = Math.ceil(endDate.diff(startDate, 'weeks', true)) + 1;
    expect(wrapper.find('.header-bottom').children()).toHaveLength(weeks);
  });
  it('When mode is month it draws correctly', () => {
    // calculateMonthData(start,end,now,dayWidth)
    const now = 0;
    const dayWidth = 30;
    const wrapper = shallow(
      <Headers
        numVisibleDays={30}
        currentday={0}
        nowposition={now}
        dayWidth={dayWidth}
        mode={VIEW_MODE_MONTH}
        scrollLeft={0}
      />,
    );
    const startDate = moment().add(-BUFFER_DAYS, 'days');
    const endDate = moment().add(30 + BUFFER_DAYS, 'days');
    const months = Math.ceil(endDate.diff(startDate, 'months', true)) + 1;
    expect(wrapper.find('.header-top').children()).toHaveLength(months);
    const days = Math.trunc(endDate.diff(startDate, 'days', true));
    expect(wrapper.find('.header-middle').children()).toHaveLength(days);

    expect(wrapper.find('.header-bottom').children()).toHaveLength(days);
  });
});
