import React, { Component } from 'react';
import Config from 'libs/helpers/config/Config';
export default class VerticalSplitter extends Component {
  constructor(props) {
    super(props);
    this.state = { dragging: false };
  }

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.doMouseMove);
      document.addEventListener('mouseup', this.doMouseUp);
      document.addEventListener('touchmove', this.doTouchMove);
      document.addEventListener('touchend', this.doTouchEnd);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.doMouseMove);
      document.removeEventListener('mouseup', this.doMouseUp);
      document.removeEventListener('touchmove', this.doTouchMove);
      document.removeEventListener('touchend', this.doTouchEnd);
    }
  }

  dragStart(x) {
    this.draggingPosition = x;
    this.setState({ dragging: true });
  }

  dragProcess(x) {
    if (this.state.dragging) {
      const delta = this.draggingPosition - x;
      this.draggingPosition = x;
      this.props.onTaskListSizing(delta);
    }
  }

  dragEnd() {
    this.setState({ dragging: false });
  }

  /* eslint-disable lines-between-class-members */
  doMouseDown = e => e.button === 0 && this.dragStart(e.clientX);
  doMouseMove = e => {
    e.stopPropagation();
    this.dragProcess(e.clientX);
  };
  doMouseUp = () => this.dragEnd();

  doTouchStart = e => this.dragStart(e.touches[0].clientX);
  doTouchMove = e => {
    e.stopPropagation();
    this.dragProcess(e.touches[0].clientX);
  };
  doTouchEnd = () => this.dragEnd();
  /* eslint-enable lines-between-class-members */

  render() {
    return (
      <div
        className="verticalResizer"
        style={Config.values.taskList.verticalSeparator.style}
        onMouseDown={this.doMouseDown}
        onTouchStart={this.doTouchStart}
      >
        <div
          className="squareGrip"
          style={Config.values.taskList.verticalSeparator.grip.style}
        />
        <div
          className="squareGrip"
          style={Config.values.taskList.verticalSeparator.grip.style}
        />
        <div
          className="squareGrip"
          style={Config.values.taskList.verticalSeparator.grip.style}
        />
        <div
          className="squareGrip"
          style={Config.values.taskList.verticalSeparator.grip.style}
        />
      </div>
    );
  }
}
