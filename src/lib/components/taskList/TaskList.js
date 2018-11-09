import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Config from 'libs/helpers/config/Config';

export const VerticalLine = ({ left }) => (
  <div className="timeLine-main-data-verticalLine" style={{ left }} />
);
VerticalLine.propTypes = {
  left: PropTypes.number.isRequired,
};

const TaskRow = ({ top, itemheight, item, label, onSelectItem }) => (
  <div
    className="timeLine-side-task-row"
    style={{
      ...Config.values.taskList.task.style,
      top,
      height: itemheight,
    }}
    role="button"
    tabIndex={0}
    onKeyDown={() => onSelectItem(item)}
    onClick={() => onSelectItem(item)}
  >
    {label}
  </div>
);

export default class TaskList extends Component {
  getContainerStyle(rows) {
    const height = rows > 0 ? rows * this.props.itemheight : 10;
    return { height };
  }

  renderTaskRow(data) {
    const result = [];
    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      const item = data[i];
      if (!item) break;
      result.push(
        <TaskRow
          key={i}
          index={i}
          item={item}
          label={item.name}
          top={i * this.props.itemheight}
          itemheight={this.props.itemheight}
          isSelected={this.props.selectedItem == item}
          onUpdateTask={this.props.onUpdateTask}
          onSelectItem={this.props.onSelectItem}
        />,
      );
    }
    return result;
  }

  doScroll = () => {
    this.props.onScroll(this.refs.taskViewPort.scrollTop);
  };

  render() {
    const data = this.props.data ? this.props.data : [];
    this.containerStyle = this.getContainerStyle(data.length);
    return (
      <div className="timeLine-side">
        <div
          className="timeLine-side-title"
          style={Config.values.taskList.title.style}
        >
          <div>{Config.values.taskList.title.label}</div>
        </div>
        <div
          ref="taskViewPort"
          className="timeLine-side-task-viewPort"
          onScroll={this.doScroll}
        >
          <div
            className="timeLine-side-task-container"
            style={this.containerStyle}
          >
            {this.renderTaskRow(data)}
          </div>
        </div>
      </div>
    );
  }
}
