import { Component, Prop, h } from '@stencil/core';
import moment from 'moment-hijri';

@Component({
  tag: 'months-list',
  styleUrl: 'months-list.css',
  shadow: true
})
export class MonthsList {

  months = [
    {number: 0, name: 'محرم'},
    {number: 1, name: 'صفر'},
    {number: 2, name: 'ربيع 1'},
    {number: 3, name: 'ربيع 2'},
    {number: 4, name: 'جمادي 1'},
    {number: 5, name: 'جمادي 2'},
    {number: 6, name: 'رجب'},
    {number: 7, name: 'شعبان'},
    {number: 8, name: 'رمضان'},
    {number: 9, name: 'شوال'},
    {number: 10, name: 'ذو القعدة'},
    {number: 11, name: 'ذو الحجة'},
  ];


  @Prop() currentTime;
  @Prop() handleMonthChange;
  @Prop() maxDate: string;
  @Prop() minDate: string;
  @Prop() dateFormat: string = 'iYYYY/iMM/iDD';

  render() {
    let monthsList = []

    for (let i = 0; i < this.months.length; i++) {
      if (this.maxDate) {
        let maxDateMoment = moment(this.maxDate, this.dateFormat);
        if (this.currentTime.iYear() === maxDateMoment.iYear() && this.months[i].number > maxDateMoment.iMonth()) {
          continue;
        }
      }
      if (this.minDate) {
        let minDateMoment = moment(this.minDate, this.dateFormat);
        if (this.currentTime.iYear() === minDateMoment.iYear() && this.months[i].number < minDateMoment.iMonth()) {
          continue;
        }
      }
      monthsList.push(
        <option key={this.months[i].number} value={this.months[i].number} selected={this.currentTime.iMonth() == this.months[i].number}>{this.months[i].name}</option>
      )
    }

    return <select class="months-list" onChange={this.handleMonthChange}>
      {
        monthsList
      }
    </select>
  }
}


