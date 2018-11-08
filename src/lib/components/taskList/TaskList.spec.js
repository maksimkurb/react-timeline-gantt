import React from 'react';
import { shallow, mount } from 'enzyme';
import TaskList from './TaskList';
describe('Testing Firing Events ', () => {
  it('Initialize Properly and not null pointer', () => {
    const wrapper = shallow(<TaskList />);
    expect(wrapper.instance().containerStyle.height).toBe(10);
  });

  it('It render and interact properly', () => {
    const itemheight = 30;
    const data = [];
    const onSelectItem = jest.fn();
    for (let i = 0; i < 20; i++) {
      data.push({
        name: `Task Today`,
        start: new Date(),
        end: new Date().setDate(new Date().getDate(), 5),
        color: 'red',
      });
    }
    const wrapper = mount(
      <TaskList
        data={data}
        startRow={0}
        endRow={17}
        onSelectItem={onSelectItem}
        itemheight={itemheight}
      />,
    );
    expect(wrapper.instance().containerStyle.height).toBe(
      itemheight * data.length,
    );

    expect(wrapper.find('.timeLine-side-task-row')).toHaveLength(18);
    let count = 0;
    wrapper.find('.timeLine-side-task-row').forEach(node => {
      expect(node.props().style.top).toBe(count * itemheight);
      node.simulate('click');
      count += 1;
    });

    expect(onSelectItem.mock.calls.length).toBe(18);
    for (let i = 0; i < 18; i++) {
      expect(onSelectItem.mock.calls[i][0]).toBe(data[i]);
    }

    wrapper.unmount();
  });
});
