import React, { Component } from 'react';
import { DATA_CONTAINER_WIDTH } from 'libs/Const';
import DataTask from 'libs/components/viewport/DataTask';
import DateHelper from 'libs/helpers/DateHelper';
import sizeMe from 'react-sizeme';
import Config from 'libs/helpers/config/Config';

export const DataRow = ({ top, itemHeight, children }) => (
  <div
    className="timeLine-main-data-row"
    style={{
      ...Config.values.dataViewPort.rows.style,
      top,
      height: itemHeight,
    }}
  >
    {children}
  </div>
);
export class DataViewPort extends Component {
  constructor(props) {
    super(props);
    this.childDragging = false;
  }

  getContainerHeight(rows) {
    const height = rows > 0 ? rows * this.props.itemHeight : 10;
    return height;
  }

  onChildDrag = dragging => {
    this.childDragging = dragging;
  };

  // calculatePosition=(item)=>{
  //     let new_position=DateHelper.dateToPixel(item.start,this.props.nowPosition,this.props.dayWidth);
  //     let new_width=DateHelper.dateToPixel(item.end,this.props.nowPosition,this.props.dayWidth)-new_position;
  //     //Checking start
  //     if (new_position<this.props.boundaries.lower){
  //         if (new_position+new_width<this.props.boundaries.lower){
  //             //no in visible space
  //             return({left:0,width:0})
  //         }
  //         else{
  //             new_position=this.props.boundaries.lower-12;
  //         }
  //     }
  //     if (new_position>this.props.boundaries.upper){
  //             return({left:0,width:0})
  //     }
  //     if (new_position>this.props.boundaries.upper){
  //         return({left:0,width:0})
  //     }else{
  //     }
  // }

  renderRows = () => {
    const result = [];
    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      const item = this.props.data[i];
      if (!item) break;

      // FIXME PAINT IN BOUNDARIES

      const newPosition = DateHelper.dateToPixel(
        item.start,
        this.props.nowPosition,
        this.props.dayWidth,
      );
      const newWidth =
        DateHelper.dateToPixel(
          item.end,
          this.props.nowPosition,
          this.props.dayWidth,
        ) - newPosition;
      result.push(
        <DataRow
          key={i}
          label={item.name}
          top={i * this.props.itemHeight}
          left={20}
          itemHeight={this.props.itemHeight}
        >
          <DataTask
            item={item}
            label={item.name}
            nowPosition={this.props.nowPosition}
            dayWidth={this.props.dayWidth}
            color={item.color}
            left={newPosition}
            width={newWidth}
            height={this.props.itemHeight}
            onChildDrag={this.onChildDrag}
            isSelected={this.props.selectedItem === item}
            onSelectItem={this.props.onSelectItem}
            onStartCreateLink={this.props.onStartCreateLink}
            onFinishCreateLink={this.props.onFinishCreateLink}
            onTaskChanging={this.props.onTaskChanging}
            onUpdateTask={this.props.onUpdateTask}
          />
        </DataRow>,
      );
    }
    return result;
  };

  doMouseDown = e => {
    if (e.button === 0 && !this.childDragging) {
      this.props.onMouseDown(e);
    }
  };

  doMouseMove = e => {
    this.props.onMouseMove(e, this.refs.dataViewPort);
  };

  doTouchStart = e => {
    if (!this.childDragging) {
      this.props.onTouchStart(e);
    }
  };

  doTouchMove = e => {
    this.props.onTouchMove(e, this.refs.dataViewPort);
  };

  componentDidMount() {
    this.refs.dataViewPort.scrollLeft = 0;
  }

  render() {
    if (this.refs.dataViewPort) {
      this.refs.dataViewPort.scrollLeft = this.props.scrollLeft;
      this.refs.dataViewPort.scrollTop = this.props.scrollTop;
    }

    const height = this.getContainerHeight(this.props.data.length);
    return (
      <div
        ref="dataViewPort"
        id="timeLinedataViewPort"
        className="timeLine-main-data-viewPort"
        draggable="true"
        onMouseDown={this.doMouseDown}
        onMouseMove={this.doMouseMove}
        onMouseUp={this.props.onMouseUp}
        onMouseLeave={this.props.onMouseLeave}
        onTouchStart={this.doTouchStart}
        onTouchMove={this.doTouchMove}
        onTouchEnd={this.props.onTouchEnd}
        onTouchCancel={this.props.onTouchCancel}
      >
        <div
          className="timeLine-main-data-container"
          style={{
            height,
            width: DATA_CONTAINER_WIDTH,
            maxWidth: DATA_CONTAINER_WIDTH,
          }}
        >
          {this.renderRows()}
        </div>
      </div>
    );
  }
}

export default sizeMe({ monitorWidth: true, monitorHeight: true })(
  DataViewPort,
);
