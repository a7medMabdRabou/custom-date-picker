import { Component, Prop, h, State, Watch } from '@stencil/core';
import moment from 'moment-hijri';
import { parseHijriDate, getHijriDaysInMonth } from '../../utils/date-utils';

@Component({
  tag: 'date-calender',
  styleUrl: 'date-calender.css',
  shadow: true
})
export class DateCalender {

  arabicDayNames = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
  arabicFullDayNames = ['احد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'];
  englishDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  @Prop({reflect: true}) langCode: string = 'ar';
  @Prop({reflect: true}) dateFormat: string = 'iYYYY/iMM/iDD';
  @Prop({reflect: true}) selectedDate: string = '';
  @Prop() setParentSelectedDate;
  @Prop({reflect: true}) maxDate: string;
  @Prop({reflect: true}) max: string;
  @Prop({reflect: true}) minDate: string;
  @Prop({reflect: true}) min: string;
  @Prop({reflect: true}) disableFuture: any = false;
  @Prop({reflect: true}) disablePast: any = false;
  @Prop({reflect: true}) bgcolor: string;
  @Prop({reflect: true}) selectedColor: string;
  @Prop({reflect: true}) textColor: string;
  @Prop({reflect: true}) selectedTextColor: string;
  @Prop({reflect: true}) hideToday: any = false;
  @Prop({reflect: true}) todayText: string;

  @State() currentTime: any;

  componentWillLoad() {
    let initialTime = parseHijriDate(this.selectedDate, this.dateFormat) || moment();
    this.currentTime = this.clampTimeToRange(initialTime);
  }

  @Watch('selectedDate')
  watchSelectedDate(newValue: string) {
    const parsed = parseHijriDate(newValue, this.dateFormat);
    if (parsed) {
      this.currentTime = this.clampTimeToRange(parsed);
    }
  }

  @Watch('minDate')
  @Watch('min')
  @Watch('maxDate')
  @Watch('max')
  @Watch('disableFuture')
  @Watch('disablePast')
  watchConstraints() {
    this.currentTime = this.clampTimeToRange(this.currentTime);
  }

  clampTimeToRange(time: any): any {
    if (!time) time = moment();
    let t = time.clone();
    const maxStr = this.getEffectiveMaxDate();
    const minStr = this.getEffectiveMinDate();

    if (maxStr) {
      const maxM = parseHijriDate(maxStr, this.dateFormat);
      if (maxM && t.isAfter(maxM, 'day')) {
        t = maxM.clone();
      }
    }
    if (minStr) {
      const minM = parseHijriDate(minStr, this.dateFormat);
      if (minM && t.isBefore(minM, 'day')) {
        t = minM.clone();
      }
    }
    return t;
  }

  getEffectiveMaxDate(): string | null {
    let effectiveMax = this.maxDate || this.max || null;
    const df = this.disableFuture;
    const isFutureDisabled = df === true || df === 'true' || df === '' || df === 'disable-future';

    if (isFutureDisabled) {
      const todayObj = moment().add(1, 'day');
      const todayStr = todayObj.format(this.dateFormat);

      if (!effectiveMax) {
        return todayStr;
      }

      const maxM = parseHijriDate(effectiveMax, this.dateFormat);
      if (!maxM) return todayStr;

      if (todayObj.isBefore(maxM, 'day')) {
        return todayStr;
      }
    }
    return effectiveMax;
  }

  getEffectiveMinDate(): string | null {
    let effectiveMin = this.minDate || this.min || null;
    const dp = this.disablePast;
    const isPastDisabled = dp === true || dp === 'true' || dp === '' || dp === 'disable-past';

    if (isPastDisabled) {
      const todayObj = moment().add(1, 'day');
      const todayStr = todayObj.format(this.dateFormat);

      if (!effectiveMin) {
        return todayStr;
      }

      const minM = parseHijriDate(effectiveMin, this.dateFormat);
      if (!minM) return todayStr;

      if (todayObj.isAfter(minM, 'day')) {
        return todayStr;
      }
    }
    return effectiveMin;
  }

  subtractMonth = () => {
    let prev = this.currentTime.clone().subtract(1, 'iMonth');
    const maxDays = getHijriDaysInMonth(prev.iYear(), prev.iMonth());
    if (prev.iDate() > maxDays) prev.iDate(maxDays);
    this.currentTime = this.clampTimeToRange(prev);
  }

  addMonth = () => {
    let next = this.currentTime.clone().add(1, 'iMonth');
    const maxDays = getHijriDaysInMonth(next.iYear(), next.iMonth());
    if (next.iDate() > maxDays) next.iDate(maxDays);
    this.currentTime = this.clampTimeToRange(next);
  }

  setSelectedDate = (event) => {
    let time = this.currentTime.clone();
    time.iDate(parseInt(event.target.value, 10));
    const selectedDate = time.format(this.dateFormat);

    if (this.setParentSelectedDate) {
      this.setParentSelectedDate(selectedDate, true, true);
    }
  }

  isBeforeMinMonth(): boolean {
    const minStr = this.getEffectiveMinDate();
    if (!minStr || !this.currentTime) return false;

    const minM = parseHijriDate(minStr, this.dateFormat);
    if (!minM) return false;

    let prevMonth = this.currentTime.clone().subtract(1, 'iMonth');
    const maxDays = getHijriDaysInMonth(prevMonth.iYear(), prevMonth.iMonth());
    prevMonth.iDate(maxDays).startOf('day');
    return prevMonth.isBefore(minM, 'day');
  }

  isAfterMaxMonth(): boolean {
    const maxStr = this.getEffectiveMaxDate();
    if (!maxStr || !this.currentTime) return false;

    const maxM = parseHijriDate(maxStr, this.dateFormat);
    if (!maxM) return false;

    let nextMonth = this.currentTime.clone().add(1, 'iMonth').iDate(1).startOf('day');
    return nextMonth.isAfter(maxM, 'day');
  }

  getMonthName(): string {
    if (!this.currentTime) return '';
    return this.currentTime.format('iMMMM') + ' (' + this.currentTime.format('iMM') + ') ' + this.currentTime.format('iYYYY');
  }

  handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    let time = this.currentTime.clone().iYear(newYear);

    const maxDays = getHijriDaysInMonth(time.iYear(), time.iMonth());
    if (time.iDate() > maxDays) {
      time.iDate(maxDays);
    }
    time = this.clampTimeToRange(time);
    this.currentTime = time;
  }

  handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value, 10);
    let time = this.currentTime.clone().iMonth(newMonth);

    const maxDays = getHijriDaysInMonth(time.iYear(), time.iMonth());
    if (time.iDate() > maxDays) {
      time.iDate(maxDays);
    }
    time = this.clampTimeToRange(time);
    this.currentTime = time;
  }

  isTodayAllowed(): boolean {
    const todayObj = moment().add(1, 'day').startOf('day');
    const maxStr = this.getEffectiveMaxDate();
    const minStr = this.getEffectiveMinDate();

    if (maxStr) {
      const maxM = parseHijriDate(maxStr, this.dateFormat);
      if (maxM && todayObj.isAfter(maxM, 'day')) return false;
    }
    if (minStr) {
      const minM = parseHijriDate(minStr, this.dateFormat);
      if (minM && todayObj.isBefore(minM, 'day')) return false;
    }
    return true;
  }

  selectToday = () => {
    if (!this.isTodayAllowed()) return;
    this.currentTime = moment().add(1, 'day');
    const todayStr = this.currentTime.format(this.dateFormat);

    if (this.setParentSelectedDate) {
      this.setParentSelectedDate(todayStr, true, true);
    }
  }

  render() {
    const isTodayHidden = this.hideToday === true || this.hideToday === 'true' || this.hideToday === '' || this.hideToday === 'hide-today';
    const todayLabel = this.todayText || (this.langCode === 'ar' ? 'اليوم' : 'Today');
    const canSelectToday = this.isTodayAllowed();

    let todayBtnStyle: any = {};
    if (this.bgcolor) todayBtnStyle.backgroundColor = this.bgcolor;
    if (this.textColor) todayBtnStyle.color = this.textColor;

    return (
      <div class='date-calender'>
        <div class='date-calender-controls'>
          <button class='control-button previous-button' onClick={this.subtractMonth} type="button" disabled={this.isBeforeMinMonth()}>{'<'}</button>
          <strong class='month-name'>{this.getMonthName()}</strong>
          <button class='control-button next-button' onClick={this.addMonth} type="button" disabled={this.isAfterMaxMonth()}> {'>'} </button>
          <div>
            <years-list
              currentTime={this.currentTime}
              handleYearChange={this.handleYearChange}
              maxDate={this.getEffectiveMaxDate()}
              minDate={this.getEffectiveMinDate()}
              dateFormat={this.dateFormat}
            ></years-list>
            <months-list
              currentTime={this.currentTime}
              handleMonthChange={this.handleMonthChange}
              maxDate={this.getEffectiveMaxDate()}
              minDate={this.getEffectiveMinDate()}
              dateFormat={this.dateFormat}
            ></months-list>
          </div>
        </div>
        <day-names langCode={this.langCode}></day-names>
        <month-days
          currentTime={this.currentTime}
          dateFormat={this.dateFormat}
          selectedDate={this.selectedDate}
          setSelectedDate={this.setSelectedDate}
          maxDate={this.getEffectiveMaxDate()}
          minDate={this.getEffectiveMinDate()}
          bgcolor={this.bgcolor}
          selectedColor={this.selectedColor}
          textColor={this.textColor}
          selectedTextColor={this.selectedTextColor}
        ></month-days>

        {!isTodayHidden && (
          <div class='date-calender-footer'>
            <button
              class={`today-button ${!canSelectToday ? 'disabled' : ''}`}
              onClick={this.selectToday}
              type="button"
              disabled={!canSelectToday}
              style={todayBtnStyle}
            >
              {todayLabel}
            </button>
          </div>
        )}
      </div>
    );
  }
}
