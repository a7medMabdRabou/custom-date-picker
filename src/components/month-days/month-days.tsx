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

  getFormats() {
    return [
      this.dateFormat,
      'iYYYY-iMM-iDD', 'iYYYY/iMM/iDD',
      'iYYYY-iM-iD', 'iYYYY/iM/iD',
      'iDD-iMM-iYYYY', 'iDD/iMM/iYYYY',
      'iD-iM-iYYYY', 'iD/iM/iYYYY',
      'iYYYY-iD-iM', 'iYYYY/iD/iM'
   ];
  }

  getMonthStartDayName() {
    let time = this.currentTime.clone();
    time.startOf('iMonth')
    return time.format('dd')
  }
  monthDays() {
    return this.currentTime.iDaysInMonth()
  }

  isSelectedDate(i) {
    if (!this.selectedDate) return false;
    let time = this.currentTime.clone();
    time.iDate(parseInt(i, 10))
    
    const selected = moment(this.selectedDate, this.getFormats(), true);
    if (!selected.isValid()) return false;
    
    return time.isSame(selected, 'day');
  }

  isAfterMaxDate(i) {
    if (!this.maxDate) return false;
    
    let dayMoment = this.currentTime.clone();
    dayMoment.iDate(parseInt(i, 10));
    
    // Parse the max date string
    let maxMoment = moment(this.maxDate, this.getFormats(), true);
    if (!maxMoment.isValid()) return false;
    
    return dayMoment.isAfter(maxMoment, 'day');
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


