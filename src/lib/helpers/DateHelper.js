const MIL_IN_HOUR = 1000 * 3600;
class DateHelper {
  dateToPixel(input, nowPosition, dayWidth) {

    const nowDate = this.getToday(); //
    const inputTime = new Date(input);

    // Day light saving patch
    const lightSavingDiff =
      (inputTime.getTimezoneOffset() - nowDate.getTimezoneOffset()) * 60 * 1000;
    const timeDiff = inputTime.getTime() - nowDate.getTime() - lightSavingDiff;
    const pixelWeight = dayWidth / 24; // Value in pixels of one hour
    return (timeDiff / MIL_IN_HOUR) * pixelWeight + nowPosition;
  }

  pixelToDate(position, nowPosition, dayWidth) {
    const hoursInPixel = 24 / dayWidth;
    const pixelsFromNow = position - nowPosition;
    const today = this.getToday();
    const milisecondsFromNow =
      today.getTime() + pixelsFromNow * hoursInPixel * MIL_IN_HOUR;
    const result = new Date(milisecondsFromNow);
    const lightSavingDiff =
      (result.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;
    result.setTime(result.getTime() + lightSavingDiff);
    return result;
  }

  getToday() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  monthDiff(start, end) {
    return Math.abs(
      end.getMonth() -
        start.getMonth() +
        12 * (end.getFullYear() - start.getFullYear()),
    );
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  dayToPosition = (day, now, dayWidth) => day * dayWidth + now;

  daysInYear = year => (this.isLeapYear(year) ? 366 : 365);

  isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  }
}
const helper = new DateHelper();
export default helper;
