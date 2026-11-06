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
  @Prop({reflect: true}) bgcolor: string;
  @Prop({reflect: true}) selectedColor: string;

  @State() currentTime; 

  componentWillLoad() {
    this.currentTime = this.getMoment(this.selectedDate);
  }

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

  getMoment(dateStr) {
    if (!dateStr) return moment();
    const m = moment(dateStr, this.getFormats(), true);
    return m.isValid() ? m : moment();
  }

  @Watch('selectedDate')
  watchHandler(newValue: string) {
    this.currentTime = this.getMoment(newValue);
  }

  subtractMonth = () => {
    this.currentTime = this.currentTime.clone().subtract(1, 'iMonth');
  }

  addMonth = () => {
    this.currentTime = this.currentTime.clone().add(1, 'iMonth');
  }

  setSelectedDate = (event) => {
    let time = this.currentTime.clone();
    time.iDate(parseInt(event.target.value, 10));
    const selectedDate = time.format(this.dateFormat);
    
    // We shouldn't mutate the prop directly if not intended, but keeping consistent with existing logic pattern
    // However, setParentSelectedDate is the key.
    if (this.setParentSelectedDate) {
      this.setParentSelectedDate(selectedDate, true, true);
    }
  }

  getEffectiveMaxDate() {
    let effectiveMaxDate = this.maxDate;
    
    // Check for any variant of "truthy" for disableFuture
    const df = this.disableFuture;
    const isFutureDisabled = df === true || df === 'true' || df === '' || df === 'disable-future';
    
    if (isFutureDisabled) {
      // Fix: Account for +1 day discrepancy in Hijri calendar so "Today" (21st) is enabled
      const todayObj = moment().add(1, 'day');
      const today = todayObj.format(this.dateFormat);
      
      if (!effectiveMaxDate) {
        return today;
      }
      
      const todayMoment = todayObj;
      const maxMoment = moment(effectiveMaxDate, this.getFormats(), true);
      
      if (!maxMoment.isValid()) return today;

      if (todayMoment.isBefore(maxMoment, 'day')) {
        return today;
      }
    }
    return effectiveMaxDate;
  }

  isAfterMaxMonth() {
    const effectiveMaxDate = this.getEffectiveMaxDate();
    if (!effectiveMaxDate) return false;
    
    // Check if the max date is valid
    const maxDateMoment = moment(effectiveMaxDate, this.getFormats(), true);
    if (!maxDateMoment.isValid()) return false;

    let nextMonth = this.currentTime.clone().add(1, 'iMonth').startOf('iMonth');
    return nextMonth.isAfter(maxDateMoment, 'day');
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
    // Clone to avoid mutating state directly
    let time = this.currentTime.clone();
    time.iYear(parseInt(event.target.value, 10));
    const selectedDate = time.format(this.dateFormat);
    if (this.setParentSelectedDate) {
      this.setParentSelectedDate(selectedDate, true, false);
    }
  }

  handleMonthChange = (event) => {
    let time = this.currentTime.clone();
    time.iMonth(parseInt(event.target.value, 10));
    const selectedDate = time.format(this.dateFormat);
    if (this.setParentSelectedDate) {
      this.setParentSelectedDate(selectedDate, true, false);
    }
  }

  selectToday = () => {
    // 1. Set current time to today
    // Fix: User reported Hijri date is 1 day behind. Adding 1 day to match observation.
    this.currentTime = moment().add(1, 'day');
    
    // 2. Format it according to the requested format
    const todayStr = this.currentTime.format(this.dateFormat);
    
    // 3. Update parent
    if (this.setParentSelectedDate) {
      this.setParentSelectedDate(todayStr, true, true);
    }
  }

  render() {
    const todayLabel = this.langCode === 'ar' ? 'اليوم' : 'Today';

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
    <month-days currentTime={this.currentTime} dateFormat={this.dateFormat} selectedDate={this.selectedDate} setSelectedDate={this.setSelectedDate} maxDate={this.getEffectiveMaxDate()} bgcolor={this.bgcolor} selectedColor={this.selectedColor}></month-days>
    
    <div class='date-calender-footer'>
      <button class='today-button' onClick={this.selectToday} type="button" style={this.bgcolor ? { backgroundColor: this.bgcolor } : {}}>{todayLabel}</button>
    </div>
  </div>;
  }
}


