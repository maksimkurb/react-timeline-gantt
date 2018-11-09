import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VerticalSplitter from 'libs/components/taskList/VerticalSplitter';
import Header from 'libs/components/header/Headers';
import DataViewPort from 'libs/components/viewport/DataViewPort';
import LinkViewPort from 'libs/components/links/LinkViewPort';
import TaskList from 'libs/components/taskList/TaskList';
import Registry from 'libs/helpers/registry/Registry';
import {
  VIEW_MODE_DAY,
  VIEW_MODE_WEEK,
  VIEW_MODE_MONTH,
  VIEW_MODE_YEAR,
  BUFFER_DAYS,
  DATA_CONTAINER_WIDTH,
  DAY_MONTH_MODE,
  DAY_WEEK_MODE,
  DAY_DAY_MODE,
  DAY_YEAR_MODE,
} from 'libs/Const';
import DataController from 'libs/controller/DataController';
import Config from 'libs/helpers/config/Config';
import './TimeLine.css';

class TimeLine extends Component {
  constructor(props) {
    super(props);
    this.dragging = false;
    this.draggingPosition = 0;
    this.dc = new DataController();
    this.dc.onHorizonChange = this.onHorizonChange;
    this.initialize = false;
    // This variable define the number of pixels the viewport can scroll till arrive to the end of the context
    this.pxToScroll = 1900;

    const dayWidth = this.getDayWidth(this.props.mode);
    Config.load(this.props.config);
    // Initialising state
    this.state = {
      currentday: 0, // Day that is in the 0px horizontal
      // nowPosition is the reference position, this variable support the infinit scrolling by accumulatning scroll times and redefining the 0 position
      // if we accumulat 2 scroll to the left nowPosition will be 2* DATA_CONTAINER_WIDTH
      nowPosition: 0,
      startRow: 0, //
      endRow: 10,
      sideStyle: { width: 200 },
      scrollLeft: 0,
      scrollTop: 0,
      numVisibleRows: 40,
      numVisibleDays: 60,
      dayWidth,
      interactiveMode: false,
      taskToCreate: null,
      links: [],
      mode: this.props.mode ? this.props.mode : VIEW_MODE_MONTH,
      size: { width: 1, height: 1 },
      changingTask: null,
    };
  }

  // //////////////////
  //     ON MODE    //
  // //////////////////

  getDayWidth(mode) {
    switch (mode) {
      case VIEW_MODE_DAY:
        return DAY_DAY_MODE;
      case VIEW_MODE_WEEK:
        return DAY_WEEK_MODE;
      case VIEW_MODE_MONTH:
        return DAY_MONTH_MODE;
      case VIEW_MODE_YEAR:
        return DAY_YEAR_MODE;
      default:
        return DAY_MONTH_MODE;
    }
  }

  // //////////////////
  //     ON SIZE    //
  // //////////////////

  onSize = size => {
    // If size has changed
    this.calculateVerticalScrollVariables(size);
    if (!this.initialize) {
      this.dc.initialize(
        this.state.scrollLeft + this.state.nowPosition,
        this.state.scrollLeft + this.state.nowPosition + size.width,
        this.state.nowPosition,
        this.state.dayWidth,
      );
      this.initialize = true;
    }
    this.setStartEnd();
    const newNumVisibleRows = Math.ceil(size.height / this.props.itemHeight);
    const newNumVisibleDays = this.calcNumVisibleDays(size);

    this.setState(state => {
      const rowInfo = this.calculateStartEndRows(
        newNumVisibleRows,
        this.props.data,
        state.scrollTop,
      );
      return {
        numVisibleRows: newNumVisibleRows,
        numVisibleDays: newNumVisibleDays,
        startRow: rowInfo.start,
        endRow: rowInfo.end,
        size,
      };
    });
  };

  // ///////////////////////
  //   VIEWPORT CHANGES  //
  // ///////////////////////

  verticalChange = scrollTop => {
    if (scrollTop === this.state.scrollTop) return;
    // Check if we have scrolling rows
    const rowInfo = this.calculateStartEndRows(
      this.state.numVisibleRows,
      this.props.data,
      scrollTop,
    );
    if (rowInfo.start !== this.state.start) {
      this.setState({
        scrollTop,
        startRow: rowInfo.start,
        endRow: rowInfo.end,
      });
    }
  };

  calculateStartEndRows = (numVisibleRows, data, scrollTop) => {
    const newStart = Math.trunc(scrollTop / this.props.itemHeight);
    const newEnd =
      newStart + numVisibleRows >= data.length
        ? data.length
        : newStart + numVisibleRows;
    return { start: newStart, end: newEnd };
  };

  setStartEnd = () => {
    this.dc.setStartEnd(
      this.state.scrollLeft,
      this.state.scrollLeft + this.state.size.width,
      this.state.nowPosition,
      this.state.dayWidth,
    );
  };

  horizontalChange = newScrollLeft => {
    let newNowPosition = this.state.nowPosition;
    let newLeft = -1;
    const { headerData } = this.state;
    let newStartRow = this.state.startRow;
    let newEndRow = this.state.endRow;

    // Calculating if we need to roll up the scroll
    if (newScrollLeft > this.pxToScroll) {
      // ContenLegnth-viewportLength
      newNowPosition = this.state.nowPosition - this.pxToScroll;
      newLeft = 0;
    } else if (newScrollLeft <= 0) {
      // ContenLegnth-viewportLength
      newNowPosition = this.state.nowPosition + this.pxToScroll;
      newLeft = this.pxToScroll;
    } else {
      newLeft = newScrollLeft;
    }

    // Get the day of the left position
    const currentIndx = Math.trunc(
      (newScrollLeft - this.state.nowPosition) / this.state.dayWidth,
    );

    // Calculate rows to render
    newStartRow = Math.trunc(this.state.scrollTop / this.props.itemHeight);
    newEndRow =
      newStartRow + this.state.numVisibleRows >= this.props.data.length
        ? this.props.data.length - 1
        : newStartRow + this.state.numVisibleRows;
    // If we need updates then change the state and the scroll position
    // Got you
    this.setStartEnd();
    this.setState({
      currentday: currentIndx,
      nowPosition: newNowPosition,
      headerData,
      scrollLeft: newLeft,
      startRow: newStartRow,
      endRow: newEndRow,
    });
  };

  calculateVerticalScrollVariables = size => {
    // The pixel to scroll vertically is equal to the percentage of what the viewport represent in the context multiply by the context width
    this.pxToScroll =
      (1 - size.width / DATA_CONTAINER_WIDTH) * DATA_CONTAINER_WIDTH - 1;
  };

  onHorizonChange = (lowerLimit, upLimit) => {
    if (this.props.onHorizonChange)
      this.props.onHorizonChange(lowerLimit, upLimit);
  };

  // ///////////////////
  //   MOUSE EVENTS  //
  // ///////////////////

  doMouseDown = e => {
    this.dragging = true;
    this.draggingPosition = e.clientX;
  };

  doMouseMove = e => {
    if (this.dragging) {
      const delta = this.draggingPosition - e.clientX;

      if (delta !== 0) {
        this.draggingPosition = e.clientX;
        this.horizontalChange(this.state.scrollLeft + delta);
      }
    }
  };

  doMouseUp = () => {
    this.dragging = false;
  };

  doMouseLeave = () => {
    this.dragging = false;
  };

  doTouchStart = e => {
    this.dragging = true;
    this.draggingPosition = e.touches[0].clientX;
  };

  doTouchEnd = () => {
    this.dragging = false;
  };

  doTouchMove = e => {
    if (this.dragging) {
      const delta = this.draggingPosition - e.touches[0].clientX;

      if (delta !== 0) {
        this.draggingPosition = e.touches[0].clientX;
        this.horizontalChange(this.state.scrollLeft + delta);
      }
    }
  };

  doTouchCancel = () => {
    this.dragging = false;
  };

  doMouseLeave = () => {
    // if (!e.relatedTarget.nodeName)
    //     this.dragging=false;
    this.dragging = false;
  };

  // Child communicating states
  onTaskListSizing = delta => {
    this.setState(prevState => {
      const result = { ...prevState };
      result.sideStyle = { width: result.sideStyle.width - delta };
      return result;
    });
  };

  // ///////////////////
  //   ITEMS EVENTS  //
  // ///////////////////

  onSelectItem = item => {
    if (this.props.onSelectItem && item !== this.props.selectedItem)
      this.props.onSelectItem(item);
  };

  onStartCreateLink = (task, position) => {
    this.setState({
      interactiveMode: true,
      taskToCreate: { task, position },
    });
  };

  onFinishCreateLink = (task, position) => {
    if (this.props.onCreateLink && task) {
      this.props.onCreateLink({
        start: this.state.taskToCreate,
        end: { task, position },
      });
    }
    this.setState({
      interactiveMode: false,
      taskToCreate: null,
    });
  };

  onTaskChanging = changingTask => {
    this.setState({
      changingTask,
    });
  };

  calcNumVisibleDays = size =>
    Math.ceil(size.width / this.state.dayWidth) + BUFFER_DAYS;

  checkMode() {
    if (this.props.mode !== this.state.mode && this.props.mode) {
      this.state.mode = this.props.mode;
      const newDayWidth = this.getDayWidth(this.state.mode);
      this.state.dayWidth = newDayWidth;
      this.state.numVisibleDays = this.calcNumVisibleDays(this.state.size);
      // to recalculate the now position we have to see how mwny scroll has happen
      // to do so we calculate the diff of days between current day and now
      // And we calculate how many times we have scroll
      const scrollTime = Math.ceil(
        (-this.state.currentday * this.state.dayWidth) / this.pxToScroll,
      );
      // We readjust now postion to the new number of scrolls
      this.state.nowPosition = scrollTime * this.pxToScroll;
      const scrollLeft =
        (this.state.currentday * this.state.dayWidth + this.state.nowPosition) %
        this.pxToScroll;
      // we recalculate the new scroll Left value
      this.state.scrollLeft = scrollLeft;
    }
  }

  checkNeedData = () => {
    if (this.props.data !== this.state.data) {
      this.state.data = this.props.data;
      const rowInfo = this.calculateStartEndRows(
        this.state.numVisibleRows,
        this.props.data,
        this.state.scrollTop,
      );
      this.state.startRow = rowInfo.start;
      this.state.endRow = rowInfo.end;
      Registry.registerData(this.state.data);
    }
    if (this.props.links !== this.state.links) {
      this.state.links = this.props.links;
      Registry.registerLinks(this.props.links);
    }
  };

  render() {
    this.checkMode();
    this.checkNeedData();
    return (
      <div className="timeLine">
        <div className="timeLine-side-main" style={this.state.sideStyle}>
          <TaskList
            ref={r => {
              this.taskViewPort = r;
            }}
            itemHeight={this.props.itemHeight}
            startRow={this.state.startRow}
            endRow={this.state.endRow}
            data={this.props.data}
            selectedItem={this.props.selectedItem}
            onSelectItem={this.onSelectItem}
            onUpdateTask={this.props.onUpdateTask}
            onScroll={this.verticalChange}
          />
          <VerticalSplitter onTaskListSizing={this.onTaskListSizing} />
        </div>
        <div className="timeLine-main">
          <Header
            headerData={this.state.headerData}
            numVisibleDays={this.state.numVisibleDays}
            currentday={this.state.currentday}
            nowPosition={this.state.nowPosition}
            dayWidth={this.state.dayWidth}
            mode={this.state.mode}
            scrollLeft={this.state.scrollLeft}
          />
          <DataViewPort
            ref={r => {
              this.dataViewPort = r;
            }}
            scrollLeft={this.state.scrollLeft}
            scrollTop={this.state.scrollTop}
            itemHeight={this.props.itemHeight}
            nowPosition={this.state.nowPosition}
            startRow={this.state.startRow}
            endRow={this.state.endRow}
            data={this.props.data}
            selectedItem={this.props.selectedItem}
            dayWidth={this.state.dayWidth}
            onScroll={this.scrollData}
            onMouseDown={this.doMouseDown}
            onMouseMove={this.doMouseMove}
            onMouseUp={this.doMouseUp}
            onMouseLeave={this.doMouseLeave}
            onTouchStart={this.doTouchStart}
            onTouchMove={this.doTouchMove}
            onTouchEnd={this.doTouchEnd}
            onTouchCancel={this.doTouchCancel}
            onSelectItem={this.onSelectItem}
            onUpdateTask={this.props.onUpdateTask}
            onTaskChanging={this.onTaskChanging}
            onStartCreateLink={this.onStartCreateLink}
            onFinishCreateLink={this.onFinishCreateLink}
            boundaries={{
              lower: this.state.scrollLeft,
              upper: this.state.scrollLeft + this.state.size.width,
            }}
            onSize={this.onSize}
          />
          <LinkViewPort
            scrollLeft={this.state.scrollLeft}
            scrollTop={this.state.scrollTop}
            startRow={this.state.startRow}
            endRow={this.state.endRow}
            data={this.props.data}
            nowPosition={this.state.nowPosition}
            dayWidth={this.state.dayWidth}
            interactiveMode={this.state.interactiveMode}
            taskToCreate={this.state.taskToCreate}
            onFinishCreateLink={this.onFinishCreateLink}
            changingTask={this.state.changingTask}
            selectedItem={this.props.selectedItem}
            onSelectItem={this.onSelectItem}
            itemHeight={this.props.itemHeight}
            links={this.props.links}
          />
        </div>
      </div>
    );
  }
}

TimeLine.propTypes = {
  itemHeight: PropTypes.number,
  mode: PropTypes.oneOf(['day', 'week', 'month', 'year']),
  config: PropTypes.object,
  data: PropTypes.array,
  links: PropTypes.array,
  selectedItem: PropTypes.object,

  onSelectItem: PropTypes.func,
  onCreateLink: PropTypes.func,
  onHorizonChange: PropTypes.func,
  onUpdateTask: PropTypes.func,
};

TimeLine.defaultProps = {
  itemHeight: 20,
};

export default TimeLine;
