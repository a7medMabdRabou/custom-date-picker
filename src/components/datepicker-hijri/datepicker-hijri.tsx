import { Component, Listen, h, State, Prop } from '@stencil/core';
import Popper from 'popper.js';
import { Placement } from 'popper.js';
import uuid from 'uuid';
import { parseHijriDate } from '../../utils/date-utils';

@Component({
  tag: 'datepicker-hijri',
})
export class DatepickerHijri {

  @Prop() placement: Placement = 'bottom';
  @Prop() reference: string;
  @Prop({reflect: true}) selectedDate: string = '';
  @Prop({reflect: true}) langCode: string = 'ar';
  @Prop({reflect: true}) dateFormat: string = 'iYYYY/iMM/iDD';
  @Prop() onDateSelectClose: any = true;
  @Prop({reflect: true}) maxDate: string;
  @Prop({reflect: true}) max: string;
  @Prop({reflect: true}) minDate: string;
  @Prop({reflect: true}) min: string;
  @Prop({reflect: true}) disableFuture: any = false;
  @Prop({reflect: true}) disablePast: any = false;
  @Prop({reflect: true}) bgcolor: string;
  @Prop({reflect: true}) bgColor: string;
  @Prop({reflect: true}) selectedColor: string;
  @Prop({reflect: true}) textColor: string;
  @Prop({reflect: true}) selectedTextColor: string;
  @Prop({reflect: true}) hideToday: any = false;
  @Prop({reflect: true}) todayText: string;
  @Prop({reflect: true}) placeholder: string;
  @Prop({reflect: true}) zIndex: string = '99999';
  @Prop({reflect: true}) disabled: any = false;

  @State() displayCalender: boolean = false;
  @State() calenderContainerId: string;

  private getEffectiveBgColor(): string {
    return this.bgcolor || this.bgColor;
  }

  private shouldCloseOnDateSelect(): boolean {
    return this.onDateSelectClose !== false && this.onDateSelectClose !== 'false';
  }

  private getEffectiveMaxDate(): string | null {
    if (this.maxDate) return this.maxDate;
    if (this.max) return this.max;
    if (this.reference) {
      const refEl = document.querySelector('#' + this.reference);
      if (refEl) {
        return refEl.getAttribute('max-date') || refEl.getAttribute('max') || null;
      }
    }
    return null;
  }

  private getEffectiveMinDate(): string | null {
    if (this.minDate) return this.minDate;
    if (this.min) return this.min;
    if (this.reference) {
      const refEl = document.querySelector('#' + this.reference);
      if (refEl) {
        return refEl.getAttribute('min-date') || refEl.getAttribute('min') || null;
      }
    }
    return null;
  }

  handleOnfocus() {
    if (this.disabled === true || this.disabled === 'true' || this.disabled === '') return;
    const reference = document.querySelector('#' + this.reference) as HTMLInputElement;
    if (reference && reference.value) {
      const m = parseHijriDate(reference.value, this.dateFormat);
      if (m) {
        this.selectedDate = reference.value;
      }
    }
    this.displayCalender = true;
  }

  private isClickOnReference(e: MouseEvent | UIEvent): boolean {
    if (!this.reference) return false;
    const refEl = document.querySelector('#' + this.reference) as HTMLElement | null;
    if (!refEl) return false;

    if (e && typeof e.composedPath === 'function') {
      const path = e.composedPath();
      if (path && path.includes(refEl)) {
        return true;
      }
    }

    const target = e.target as HTMLElement | null;
    if (!target) return false;

    return target.id === this.reference || refEl.contains(target);
  }

  private isClickInsideCalender(e: MouseEvent | UIEvent): boolean {
    const calenderEl = document.getElementById(this.calenderContainerId);
    if (!calenderEl) return false;

    if (e && typeof e.composedPath === 'function') {
      const path = e.composedPath();
      if (path && path.includes(calenderEl)) {
        return true;
      }
    }

    const target = e.target as HTMLElement | null;
    if (!target) return false;

    return this.hasSomeParentId(target, this.calenderContainerId);
  }

  @Listen('click', { target: 'window' })
  handleOnClickOutSide(e: MouseEvent) {
    if (!this.displayCalender) return;
    if (!this.isClickInsideCalender(e) && !this.isClickOnReference(e)) {
      this.displayCalender = false;
    }
  }

  // Check if the element has an ancestor with idName
  hasSomeParentId(element, idName) {
    if (!element) return false;
    if (element.id === idName) return true;
    if (!element.parentNode) return false;
    return this.hasSomeParentId(element.parentNode, idName);
  }

  setSelectedDate = (selectedDate, triggerEvent = true, closePicker = true) => {
    this.selectedDate = selectedDate;

    var reference = document.querySelector('#' + this.reference);
    if (reference) {
      reference.setAttribute('value', this.selectedDate);
      (reference as HTMLInputElement).value = this.selectedDate;
      if (triggerEvent)
        reference.dispatchEvent(new Event('change'));
    }

    if (this.shouldCloseOnDateSelect() && closePicker)
      this.displayCalender = false;
  }

  componentWillLoad() {
    this.calenderContainerId = uuid('datepicker-hijri');

    const refEl = this.reference ? document.querySelector('#' + this.reference) : null;
    if (refEl) {
      const currentVal = refEl.getAttribute('value');
      if (currentVal && parseHijriDate(currentVal, this.dateFormat)) {
        this.selectedDate = currentVal;
        this.setSelectedDate(this.selectedDate, false, false);
      }
    }
  }

  private attachToReference() {
    if (!this.reference) return;
    const reference = document.querySelector('#' + this.reference) as HTMLInputElement | null;
    if (!reference) return;

    if (this.placeholder && !reference.getAttribute('placeholder')) {
      reference.setAttribute('placeholder', this.placeholder);
    }

    if (this.disabled === true || this.disabled === 'true' || this.disabled === '') {
      reference.disabled = true;
      return;
    }

    reference.addEventListener('focus', () => this.handleOnfocus());
    reference.addEventListener('click', () => this.handleOnfocus());
    const popperEl = document.getElementById(this.calenderContainerId);
    if (popperEl) {
      new Popper(reference, popperEl, { placement: this.placement });
    }
  }

  componentDidLoad() {
    const tryAttach = (attempt: number) => {
      const refEl = this.reference ? document.querySelector('#' + this.reference) : null;
      if (refEl) {
        this.attachToReference();
        return;
      }
      if (attempt < 8) {
        setTimeout(() => tryAttach(attempt + 1), 50 * (attempt + 1));
      }
    };
    tryAttach(0);
  }

  render() {
    return (
      <div
        id={this.calenderContainerId}
        style={{
          'visibility': this.displayCalender ? 'visible' : 'hidden',
          'z-index': this.zIndex || '99999',
          'margin': '5px'
        }}
      >
        <date-calender
          langCode={this.langCode}
          dateFormat={this.dateFormat}
          selectedDate={this.selectedDate}
          setParentSelectedDate={this.setSelectedDate}
          maxDate={this.getEffectiveMaxDate()}
          minDate={this.getEffectiveMinDate()}
          disableFuture={this.disableFuture}
          disablePast={this.disablePast}
          bgcolor={this.getEffectiveBgColor()}
          selectedColor={this.selectedColor}
          textColor={this.textColor}
          selectedTextColor={this.selectedTextColor}
          hideToday={this.hideToday}
          todayText={this.todayText}
        ></date-calender>
      </div>
    );
  }
}
