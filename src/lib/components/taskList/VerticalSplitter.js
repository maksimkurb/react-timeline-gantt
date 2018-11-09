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

  dragStart(x, e) {
    e.stopPropagation();
    this.draggingPosition = x;
    this.setState({ dragging: true });
  }

  dragProcess(x, e) {
    e.stopPropagation();
    if (this.state.dragging) {
      const delta = this.draggingPosition - x;
      this.draggingPosition = x;
      this.props.onTaskListSizing(delta);
    }
  }

  dragEnd(e) {
    e.stopPropagation();
    this.setState({ dragging: false });
  }

  doMouseDown = e => e.button === 0 && this.dragStart(e.clientX, e);

  doMouseMove = e => this.dragProcess(e.clientX, e);

  doMouseUp = e => this.dragEnd(e);

  doTouchStart = e => this.dragStart(e.touches[0].clientX, e);

  doTouchMove = e => this.dragProcess(e.touches[0].clientX, e);

  doTouchEnd = e => this.dragEnd(e);

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
