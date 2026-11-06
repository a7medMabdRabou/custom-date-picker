import { Component, Listen, h, State, Prop } from '@stencil/core';
import Popper from 'popper.js';
import {Placement} from 'popper.js';import uuid from 'uuid';
import moment from 'moment-hijri';

@Component({
  tag: 'datepicker-hijri',
  // styleUrl: 'tippy.js/dist/tippy.css'
})
export class DatepickerHijri {

  @Prop() placement: Placement = 'bottom';
  @Prop() reference: string;
  @Prop({reflect: true}) selectedDate: string = '';
  @Prop({reflect: true}) langCode: string = 'ar';
  @Prop({reflect: true}) dateFormat: string = 'iYYYY/iMM/iDD';
  @Prop() onDateSelectClose: any = true;
  @Prop({reflect: true}) maxDate: string;
  @Prop({reflect: true}) disableFuture: any = false;

  @State() displayCalender: boolean = false;
  @State() calenderContainerId: string;

  private shouldCloseOnDateSelect(): boolean {
    return this.onDateSelectClose !== false && this.onDateSelectClose !== 'false';
  }

  // List of supported formats for robust parsing
  getSupportedFormats() {
    return [
      this.dateFormat,
      'iYYYY-iMM-iDD', 'iYYYY/iMM/iDD',
      'iYYYY-iM-iD', 'iYYYY/iM/iD',
      'iDD-iMM-iYYYY', 'iDD/iMM/iYYYY',
      'iD-iM-iYYYY', 'iD/iM/iYYYY',
      'iYYYY-iD-iM', 'iYYYY/iD/iM'
    ];
  }

  handleOnfocus()
  {
    const reference = document.querySelector('#'+this.reference) as HTMLInputElement;
    if (reference) {
      const m = moment(reference.value, this.getSupportedFormats(), true);
      if (m && m.isValid && m.isValid()) {
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

    var reference = document.querySelector('#'+this.reference);
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
    this.calenderContainerId = uuid('datepicker-hijri')

    // This will fix the datepicker when the selected date is null or empty (only if reference exists yet)
    const refEl = this.reference ? document.querySelector('#' + this.reference) : null;
    const formats = this.getSupportedFormats();

    if (refEl && !moment(this.selectedDate, formats, true).isValid()) {
      var selectedDate;
      const currentVal = refEl.getAttribute('value');
      
      if (currentVal && moment(currentVal, formats, true).isValid()) {
        selectedDate = currentVal;
        this.selectedDate = selectedDate;
        this.setSelectedDate(this.selectedDate, false, false);
      }
    }
  }

  private attachToReference() {
    if (!this.reference) return;
    const reference = document.querySelector('#' + this.reference) as HTMLElement;
    if (!reference) return;

    reference.addEventListener('focus', () => this.handleOnfocus());
    reference.addEventListener('click', () => this.handleOnfocus());
    const popperEl = document.getElementById(this.calenderContainerId);
    if (popperEl) {
      new Popper(reference, popperEl, { placement: this.placement });
    }
  }

  componentDidLoad() {
    // React/MUI may render the input after this component; retry until reference exists
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
    return <div id={this.calenderContainerId} style={{ 'visibility': this.displayCalender ? 'visible' : 'hidden', 'z-index': '99999', 'margin': '5px'}}>
            <date-calender langCode={this.langCode} dateFormat={this.dateFormat} selectedDate={this.selectedDate} setParentSelectedDate={this.setSelectedDate} maxDate={this.maxDate} disableFuture={this.disableFuture}></date-calender>
      </div>
  }
}


