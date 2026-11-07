import { Component, Prop, h } from '@stencil/core';
import { parseHijriDate, getHijriDaysInMonth } from '../../utils/date-utils';

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
  @Prop({reflect: true}) minDate: string;
  @Prop({reflect: true}) bgcolor: string;
  @Prop({reflect: true}) selectedColor: string;
  @Prop({reflect: true}) textColor: string;
  @Prop({reflect: true}) selectedTextColor: string;

  getMonthStartDayName() {
    let time = this.currentTime.clone();
    time.startOf('iMonth');
    return time.format('dd');
  }

  monthDays() {
    if (!this.currentTime) return 30;
    return getHijriDaysInMonth(this.currentTime.iYear(), this.currentTime.iMonth());
  }

  isSelectedDate(i) {
    if (!this.selectedDate || !this.currentTime) return false;
    const selected = parseHijriDate(this.selectedDate, this.dateFormat);
    if (!selected) return false;

    let dayMoment = this.currentTime.clone().iDate(parseInt(i, 10)).startOf('day');
    return dayMoment.isSame(selected, 'day');
  }

  isAfterMaxDate(i) {
    if (!this.maxDate || !this.currentTime) return false;

    const maxMoment = parseHijriDate(this.maxDate, this.dateFormat);
    if (!maxMoment) return false;

    let dayMoment = this.currentTime.clone().iDate(parseInt(i, 10)).startOf('day');
    return dayMoment.isAfter(maxMoment, 'day');
  }

  isBeforeMinDate(i) {
    if (!this.minDate || !this.currentTime) return false;

    const minMoment = parseHijriDate(this.minDate, this.dateFormat);
    if (!minMoment) return false;

    let dayMoment = this.currentTime.clone().iDate(parseInt(i, 10)).startOf('day');
    return dayMoment.isBefore(minMoment, 'day');
  }

  render() {
    let daysList = [];
    for (let i = this.englishDayNames.indexOf(this.getMonthStartDayName()); i > 0; i--) {
      daysList.push(
        <div class='month-day no-hover' key={daysList.length.toString()}></div>
      );
    }

    const totalDays = this.monthDays();
    for (let i = 1; i <= totalDays; i++) {
      const isFuture = this.isAfterMaxDate(i);
      const isPastDisabled = this.isBeforeMinDate(i);
      const isDisabled = isFuture || isPastDisabled;
      const isSelected = this.isSelectedDate(i);
      let btnStyle: any = {};

      if (isSelected && this.selectedColor) {
        btnStyle.backgroundColor = this.selectedColor;
      } else if (!isSelected && !isDisabled && this.bgcolor) {
        btnStyle.backgroundColor = this.bgcolor;
      }

      if (isSelected && this.selectedTextColor) {
        btnStyle.color = this.selectedTextColor;
      } else if (this.textColor) {
        btnStyle.color = this.textColor;
      }

      daysList.push(
        <button
          class={`month-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          type='button'
          disabled={isDisabled}
          style={btnStyle}
          onClick={this.setSelectedDate}
          value={i}
        >
          {i}
        </button>
      );
    }

    return (
      <div class='month-days'>
        {daysList}
      </div>
    );
  }
}
