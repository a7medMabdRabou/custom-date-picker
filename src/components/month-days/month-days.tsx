import { Component, Prop, h } from '@stencil/core';
import moment from 'moment-hijri';

@Component({
  tag: 'month-days',
  styleUrl: 'month-days.css',
  shadow: true
})
export class MonthDays {

  englishDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  @Prop() setSelectedDate;
  @Prop() currentTime;
  @Prop() dateFormat;
  @Prop() selectedDate;
  @Prop() maxDate: string;

  getMonthStartDayName() {
    let time = this.currentTime
    time.startOf('iMonth')
    return time.format('dd')
  }
  monthDays() {
    return this.currentTime.iDaysInMonth()
  }

  isSelectedDate(i) {
    let time = this.currentTime
    time.iDate(parseInt(i, 10))
    return this.selectedDate === time.format(this.dateFormat)
  }

  isAfterMaxDate(i) {
    if (!this.maxDate) return false;
    let time = moment(this.currentTime.format(this.dateFormat), this.dateFormat);
    time.iDate(parseInt(i, 10));
    return time.isAfter(moment(this.maxDate, this.dateFormat), 'day');
  }

  render() {
    let daysList = []
    for (let i = this.englishDayNames.indexOf(this.getMonthStartDayName()); i > 0; i--){
      daysList.push(
        <div class='month-day no-hover' key={daysList.length.toString()}></div>
      )
    }
    for (let i = 1; i < this.monthDays() + 1; i++) {
      const isFuture = this.isAfterMaxDate(i);
      daysList.push(
        <div class={'month-day ' + (this.isSelectedDate(i)? 'selected' : '') + (isFuture ? ' disabled' : '')} key={daysList.length.toString()}>
          <button class={'month-day-button ' + (this.isSelectedDate(i)? 'selected' : '') + (isFuture ? ' disabled' : '')} onClick={this.setSelectedDate} value={i} type="button" disabled={isFuture}>{i}</button>
        </div>
      )
    }


    return <div class='month-days'>
      {
        daysList
      }
    </div>
  }
}


