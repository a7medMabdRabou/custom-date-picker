import { Component, Prop, h, State, Watch } from '@stencil/core';
import moment from 'moment-hijri';

@Component({
  tag: 'date-calender',
  styleUrl: 'date-calender.css',
  shadow: true
})
export class DateCalender {

  arabicDayNames = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
  arabicFullDayNames = ['احد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'];
  englishDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  /**
   * The language code
   */
  @Prop({reflect: true}) langCode: string = 'ar';
  @Prop({reflect: true}) dateFormat: string = 'iYYYY/iMM/iDD';
  @Prop({reflect: true}) selectedDate: string = '';
  @Prop() setParentSelectedDate;
  @Prop({reflect: true}) maxDate: string;
  @Prop({reflect: true}) disableFuture: any = false;

  @State() currentTime = moment(this.selectedDate, this.dateFormat);

  @Watch('selectedDate')
  watchHandler(newValue: string) {
    this.currentTime = moment(newValue, this.dateFormat);
  }

  subtractMonth = () => {
    let currentTime = moment(this.currentTime.format(this.dateFormat), this.dateFormat);
    this.currentTime = currentTime.subtract(1, 'iMonth');
  }

  addMonth = () => {
    let currentTime = moment(this.currentTime.format(this.dateFormat), this.dateFormat);
    this.currentTime = currentTime.add(1, 'iMonth');
  }

  setSelectedDate = (event) => {
    let time = this.currentTime;
    time.iDate(parseInt(event.target.value, 10));
    const selectedDate = time.format(this.dateFormat);
    this.selectedDate = selectedDate;

    this.setParentSelectedDate(this.selectedDate);
  }

  getEffectiveMaxDate() {
    let effectiveMaxDate = this.maxDate;
    
    // Check for any variant of "truthy" for disableFuture
    const df = this.disableFuture;
    const isFutureDisabled = df === true || df === 'true' || df === '' || df === 'disable-future';
    
    if (isFutureDisabled) {
      const today = moment().format(this.dateFormat);
      if (!effectiveMaxDate) {
        return today;
      }
      
      const todayMoment = moment(today, this.dateFormat);
      const maxMoment = moment(effectiveMaxDate, this.dateFormat);
      
      if (todayMoment.isBefore(maxMoment, 'day')) {
        return today;
      }
    }
    return effectiveMaxDate;
  }

  isAfterMaxMonth() {
    const effectiveMaxDate = this.getEffectiveMaxDate();
    if (!effectiveMaxDate) return false;
    let nextMonth = moment(this.currentTime.format(this.dateFormat), this.dateFormat).add(1, 'iMonth').startOf('iMonth');
    return nextMonth.isAfter(moment(effectiveMaxDate, this.dateFormat), 'day');
  }

  getMonthStartDayName() {
    let time = this.currentTime
    time.startOf('iMonth')
    return time.format('dd')
  }

  getMonthName() {
    return this.currentTime.format('iMMMM') + ' ('+this.currentTime.format('iMM')+') ' + this.currentTime.format('iYYYY');
  }

  handleYearChange = (event) => {
    let time = this.currentTime
    time.iYear(parseInt(event.target.value, 10))
    const selectedDate = time.format(this.dateFormat);
    this.selectedDate = selectedDate;
  }

  handleMonthChange = (event) => {
    let time = this.currentTime
    time.iMonth(parseInt(event.target.value, 10))
    const selectedDate = time.format(this.dateFormat);
    this.selectedDate = selectedDate;
  }

  render() {
    return <div class='date-calender'>
    <div class='date-calender-controls'>
      <button class='control-button previous-button' onClick={this.subtractMonth} type="button">{'<'}</button>
      <strong class='month-name'>{this.getMonthName()}</strong>
      <button class='control-button next-button' onClick={this.addMonth} type="button" disabled={this.isAfterMaxMonth()}> {'>'} </button>
      <div>
        <years-list currentTime={this.currentTime} handleYearChange={this.handleYearChange} maxDate={this.getEffectiveMaxDate()} dateFormat={this.dateFormat}></years-list>
        <months-list currentTime={this.currentTime} handleMonthChange={this.handleMonthChange} maxDate={this.getEffectiveMaxDate()} dateFormat={this.dateFormat}></months-list>

      </div>
    </div>
    <day-names langCode={this.langCode}></day-names>
    <month-days currentTime={this.currentTime} dateFormat={this.dateFormat} selectedDate={this.selectedDate} setSelectedDate={this.setSelectedDate} maxDate={this.getEffectiveMaxDate()}></month-days>
  </div>;
  }
}


