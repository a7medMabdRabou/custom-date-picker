import { Component, Prop, h } from '@stencil/core';
import { parseHijriDate } from '../../utils/date-utils';

@Component({
  tag: 'years-list',
  styleUrl: 'years-list.css',
  shadow: true
})
export class YearsList {

  minYear = 1356;
  maxYear = 1500;

  @Prop() currentTime;
  @Prop() handleYearChange;
  @Prop() maxDate: string;
  @Prop() minDate: string;
  @Prop() dateFormat: string = 'iYYYY/iMM/iDD';

  render() {
    let yearsList = [];
    let maxYear = this.maxYear;
    let minYear = this.minYear;

    if (this.maxDate) {
      const maxM = parseHijriDate(this.maxDate, this.dateFormat);
      if (maxM) {
        maxYear = maxM.iYear();
      }
    }
    if (this.minDate) {
      const minM = parseHijriDate(this.minDate, this.dateFormat);
      if (minM) {
        minYear = minM.iYear();
      }
    }

    if (minYear > maxYear) {
      const tmp = minYear;
      minYear = maxYear;
      maxYear = tmp;
    }

    const currentYear = this.currentTime ? this.currentTime.iYear() : minYear;

    for (let i = minYear; i <= maxYear; i++) {
      yearsList.push(
        <option key={i} value={i} selected={currentYear === i}>{i}</option>
      );
    }

    return (
      <select class="years-list" onChange={this.handleYearChange}>
        {yearsList}
      </select>
    );
  }
}
