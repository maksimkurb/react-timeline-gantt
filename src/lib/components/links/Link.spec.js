import React from 'react';
import { shallow } from 'enzyme';
import Link from './Link';

describe('Testing Links ', () => {
  it('Test when start is less than end in X', () => {
    const start = { x: 10, y: 30 };
    const end = { x: 100, y: 200 };
    const wrapper = shallow(<Link start={start} end={end} />);
    const coordinates = wrapper.instance().calcNormCoordinates();
    expect(coordinates.cpt1.x).toBe(55);
    expect(coordinates.cpt1.y).toBe(30);
    expect(coordinates.cpt2.x).toBe(55);
    expect(coordinates.cpt2.y).toBe(200);
    const path = wrapper.instance().getPath(coordinates);
    expect(path).toBe('M10 30  55 30 55 200 100 200');
  });
  it('Test when start is less than end in X', () => {
    const start = { x: 110, y: 30 };
    const end = { x: 100, y: 200 };
    const wrapper = shallow(<Link start={start} end={end} />);
    const coordinates = wrapper.instance().calcSCoordinates();
    expect(coordinates.cpt1.x).toBe(110 + 20);
    expect(coordinates.cpt1.y).toBe(30);
    expect(coordinates.cpt2.x).toBe(130);
    expect(coordinates.cpt2.y).toBe(115);
    expect(coordinates.cpt3.x).toBe(80);
    expect(coordinates.cpt3.y).toBe(115);
    expect(coordinates.cpt4.x).toBe(80);
    expect(coordinates.cpt4.y).toBe(200);
    const path = wrapper.instance().getPath(coordinates);
    expect(path).toBe('M110 30  130 30 130 115 80 115 80 200 100 200');
  });
});
