import React from 'react';
import Registry from 'libs/helpers/registry/Registry';
import { shallow, mount } from 'enzyme';
import LinkViewPort from './LinkViewPort';

describe('Testing LinksViewPort ', () => {
  it('Initialize Properly and not null pointer', () => {
    const wrapper = shallow(<LinkViewPort />);
    expect(wrapper.state().data).toBeUndefined();
    expect(wrapper.state().links).toBeUndefined();
    expect(wrapper.instance().cache).toHaveLength(0);
  });

  it('Render properly when data is pass', () => {
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        name: `Task Today`,
        id: i,
        start: new Date(),
        end: new Date().setDate(new Date().getDate(), 5),
        color: 'red',
      });
    }
    Registry.registerData(data);
    const links = [];
    for (let i = 0; i < 20; i++) {
      links.push({ id: i, start: i, end: i });
    }
    Registry.registerLinks(data);
    const wrapper = mount(
      <LinkViewPort
        startRow={0}
        endRow={0}
        data={data}
        nowPosition={0}
        dayWidth={30}
        links={links}
      />,
    );
    expect(wrapper.instance().cache).toHaveLength(20);
    const renderItems = wrapper.instance().cache;
    expect(wrapper.find('.timeline-link')).toHaveLength(20);
    // wrapper.find('.timeline-link').forEach((node)=>{
    //     expect(node).toHaveLength(20)
    // })
  });
});
