import { Component, Prop, h } from '@stencil/core';
import { parseHijriDate } from '../../utils/date-utils';

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
    let monthsList = [];
    const curYear = this.currentTime ? this.currentTime.iYear() : 1446;
    const curMonth = this.currentTime ? this.currentTime.iMonth() : 0;
    const maxM = this.maxDate ? parseHijriDate(this.maxDate, this.dateFormat) : null;
    const minM = this.minDate ? parseHijriDate(this.minDate, this.dateFormat) : null;

    for (let i = 0; i < this.months.length; i++) {
      const monthNum = this.months[i].number;
      if (maxM) {
        if (curYear > maxM.iYear()) continue;
        if (curYear === maxM.iYear() && monthNum > maxM.iMonth()) continue;
      }
      if (minM) {
        if (curYear < minM.iYear()) continue;
        if (curYear === minM.iYear() && monthNum < minM.iMonth()) continue;
      }
      monthsList.push(
        <option key={monthNum} value={monthNum} selected={curMonth === monthNum}>{this.months[i].name}</option>
      );
    }

    return (
      <select class="months-list" onChange={this.handleMonthChange}>
        {monthsList}
      </select>
    );
  }
}
