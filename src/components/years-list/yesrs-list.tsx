import { Component, Prop, h } from '@stencil/core';
import moment from 'moment-hijri';

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

  render() {
    let yearsList = []
    let maxYear = this.maxYear;
    if (this.maxDate) {
      maxYear = moment(this.maxDate, 'iYYYY/iMM/iDD').iYear();
    }

    for (let i = this.minYear; i <= maxYear; i++) {
      yearsList.push(
        <option key={i} value={i} selected={this.currentTime.iYear() == i}>{i}</option>
      )
    }

    return <select class="years-list" onChange={this.handleYearChange}>
      {
        yearsList
      }
    </select>
  }
}


