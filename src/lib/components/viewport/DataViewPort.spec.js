import React from 'react';
import { shallow, mount } from 'enzyme';
import { DataViewPort, DataRow } from './DataTask';
// import DateHelper from 'libs/helpers/DateHelper'

describe('Testing DataRow ', () => {
  it('Initialize Properly and calculate style', () => {
    // const wrapper =mount(<DataRow top={10}
    // itemHeight={30}/>);
    // expect(wrapper.instance().style.top).toBe(10)
    // expect(wrapper.instance().style.height).toBe(30)
  });

  // it('Initialize Properly and not null pointer',()=>{
  //     const wrapper =shallow(<DataTask  left={0}
  //                                         width={80}
  //                                         color='red'/>);
  //     let style=wrapper.instance().calculateStyle();
  //     expect(style.left).toBe(0);
  //     expect(style.width).toBe(80);
  //     expect(style.backgroundColor).toBe('red');
  //    // expect(wrapper.instance().containerStyle.height).toBe(10);

  // })

  // it('Move and handle mouse event properly',()=>{
  //     let onChildDrag=jest.fn();
  //     let onUpdateTask=jest.fn();
  //     let item={name:'this Item'}
  //     let dayWidth=30;
  //     let nowPosition=0;
  //     const wrapper =shallow(<DataTask
  //                                 nowPosition={nowPosition}
  //                                 dayWidth={dayWidth}
  //                                 onChildDrag={onChildDrag}
  //                                 onUpdateTask={onUpdateTask}
  //                                 item={item}
  //                                 left={0}
  //                                 width={80}
  //                                 color='red'/>);
  //     expect(wrapper.state().dragging).toBe(false);
  //     wrapper.instance().doMouseDown({button:1,clientX:10})
  //     expect(wrapper.state().dragging).toBe(false);
  //     wrapper.instance().doMouseDown({button:0,clientX:10})
  //     expect(wrapper.state().dragging).toBe(true);
  //     expect(wrapper.state().left).toBe(0);
  //     expect(wrapper.instance().draggingPosition).toBe(10);
  //     expect(onChildDrag.mock.calls.length).toBe(1);
  //     expect(onChildDrag.mock.calls[0][0]).toBe(true)

  //     wrapper.instance().doMouseMove({button:0,clientX:20})
  //     expect(wrapper.state().left).toBe(10);
  //     expect(wrapper.instance().draggingPosition).toBe(20);
  //     let style=wrapper.instance().calculateStyle();
  //     expect(style.left).toBe(10);
  //     expect(style.width).toBe(80);
  //     expect(style.backgroundColor).toBe('red');
  //     wrapper.instance().doMouseUp()
  //     expect(onChildDrag.mock.calls.length).toBe(2);
  //     expect(onChildDrag.mock.calls[1][0]).toBe(false)
  //     expect(onUpdateTask.mock.calls.length).toBe(1);
  //     expect(onUpdateTask.mock.calls[0][0]).toBe(item)
  //     let new_start_date=DateHelper.pixelToDate(10,nowPosition,dayWidth);
  //     let new_end_date=DateHelper.pixelToDate(90,nowPosition,dayWidth);

  //     expect(new_start_date.getTime()-onUpdateTask.mock.calls[0][1].start.getTime()<10).toBe(true)
  //     expect(new_end_date.getTime()-onUpdateTask.mock.calls[0][1].end.getTime()<10).toBe(true)

  // })
});
