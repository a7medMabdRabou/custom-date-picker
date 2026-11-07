import { Component, Listen, h, State, Prop } from '@stencil/core';
import Popper from 'popper.js';
import uuid from 'uuid';
import { parseHijriDate } from '../../utils/date-utils';
export class DatepickerHijri {
    constructor() {
        this.placement = 'bottom';
        this.selectedDate = '';
        this.langCode = 'ar';
        this.dateFormat = 'iYYYY/iMM/iDD';
        this.onDateSelectClose = true;
        this.disableFuture = false;
        this.disablePast = false;
        this.hideToday = false;
        this.zIndex = '99999';
        this.disabled = false;
        this.displayCalender = false;
        this.setSelectedDate = (selectedDate, triggerEvent = true, closePicker = true) => {
            this.selectedDate = selectedDate;
            var reference = document.querySelector('#' + this.reference);
            if (reference) {
                reference.setAttribute('value', this.selectedDate);
                reference.value = this.selectedDate;
                if (triggerEvent)
                    reference.dispatchEvent(new Event('change'));
            }
            if (this.shouldCloseOnDateSelect() && closePicker)
                this.displayCalender = false;
        };
    }
    getEffectiveBgColor() {
        return this.bgcolor || this.bgColor;
    }
    shouldCloseOnDateSelect() {
        return this.onDateSelectClose !== false && this.onDateSelectClose !== 'false';
    }
    getEffectiveMaxDate() {
        if (this.maxDate)
            return this.maxDate;
        if (this.max)
            return this.max;
        if (this.reference) {
            const refEl = document.querySelector('#' + this.reference);
            if (refEl) {
                return refEl.getAttribute('max-date') || refEl.getAttribute('max') || null;
            }
        }
        return null;
    }
    getEffectiveMinDate() {
        if (this.minDate)
            return this.minDate;
        if (this.min)
            return this.min;
        if (this.reference) {
            const refEl = document.querySelector('#' + this.reference);
            if (refEl) {
                return refEl.getAttribute('min-date') || refEl.getAttribute('min') || null;
            }
        }
        return null;
    }
    handleOnfocus() {
        if (this.disabled === true || this.disabled === 'true' || this.disabled === '')
            return;
        const reference = document.querySelector('#' + this.reference);
        if (reference && reference.value) {
            const m = parseHijriDate(reference.value, this.dateFormat);
            if (m) {
                this.selectedDate = reference.value;
            }
        }
        this.displayCalender = true;
    }
    isClickOnReference(e) {
        if (!this.reference)
            return false;
        const refEl = document.querySelector('#' + this.reference);
        if (!refEl)
            return false;
        if (e && typeof e.composedPath === 'function') {
            const path = e.composedPath();
            if (path && path.includes(refEl)) {
                return true;
            }
        }
        const target = e.target;
        if (!target)
            return false;
        return target.id === this.reference || refEl.contains(target);
    }
    isClickInsideCalender(e) {
        const calenderEl = document.getElementById(this.calenderContainerId);
        if (!calenderEl)
            return false;
        if (e && typeof e.composedPath === 'function') {
            const path = e.composedPath();
            if (path && path.includes(calenderEl)) {
                return true;
            }
        }
        const target = e.target;
        if (!target)
            return false;
        return this.hasSomeParentId(target, this.calenderContainerId);
    }
    handleOnClickOutSide(e) {
        if (!this.displayCalender)
            return;
        if (!this.isClickInsideCalender(e) && !this.isClickOnReference(e)) {
            this.displayCalender = false;
        }
    }
    // Check if the element has an ancestor with idName
    hasSomeParentId(element, idName) {
        if (!element)
            return false;
        if (element.id === idName)
            return true;
        if (!element.parentNode)
            return false;
        return this.hasSomeParentId(element.parentNode, idName);
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
    attachToReference() {
        if (!this.reference)
            return;
        const reference = document.querySelector('#' + this.reference);
        if (!reference)
            return;
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
        const tryAttach = (attempt) => {
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
        return (h("div", { id: this.calenderContainerId, style: {
                'visibility': this.displayCalender ? 'visible' : 'hidden',
                'z-index': this.zIndex || '99999',
                'margin': '5px'
            } },
            h("date-calender", { langCode: this.langCode, dateFormat: this.dateFormat, selectedDate: this.selectedDate, setParentSelectedDate: this.setSelectedDate, maxDate: this.getEffectiveMaxDate(), minDate: this.getEffectiveMinDate(), disableFuture: this.disableFuture, disablePast: this.disablePast, bgcolor: this.getEffectiveBgColor(), selectedColor: this.selectedColor, textColor: this.textColor, selectedTextColor: this.selectedTextColor, hideToday: this.hideToday, todayText: this.todayText })));
    }
    static get is() { return "datepicker-hijri"; }
    static get properties() { return {
        "placement": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "Placement",
                "resolved": "\"auto\" | \"auto-end\" | \"auto-start\" | \"bottom\" | \"bottom-end\" | \"bottom-start\" | \"left\" | \"left-end\" | \"left-start\" | \"right\" | \"right-end\" | \"right-start\" | \"top\" | \"top-end\" | \"top-start\"",
                "references": {
                    "Placement": {
                        "location": "import",
                        "path": "popper.js"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "placement",
            "reflect": false,
            "defaultValue": "'bottom'"
        },
        "reference": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "reference",
            "reflect": false
        },
        "selectedDate": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "selected-date",
            "reflect": true,
            "defaultValue": "''"
        },
        "langCode": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "lang-code",
            "reflect": true,
            "defaultValue": "'ar'"
        },
        "dateFormat": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "date-format",
            "reflect": true,
            "defaultValue": "'iYYYY/iMM/iDD'"
        },
        "onDateSelectClose": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "on-date-select-close",
            "reflect": false,
            "defaultValue": "true"
        },
        "maxDate": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "max-date",
            "reflect": true
        },
        "max": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "max",
            "reflect": true
        },
        "minDate": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "min-date",
            "reflect": true
        },
        "min": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "min",
            "reflect": true
        },
        "disableFuture": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "disable-future",
            "reflect": true,
            "defaultValue": "false"
        },
        "disablePast": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "disable-past",
            "reflect": true,
            "defaultValue": "false"
        },
        "bgcolor": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "bgcolor",
            "reflect": true
        },
        "bgColor": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "bg-color",
            "reflect": true
        },
        "selectedColor": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "selected-color",
            "reflect": true
        },
        "textColor": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "text-color",
            "reflect": true
        },
        "selectedTextColor": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "selected-text-color",
            "reflect": true
        },
        "hideToday": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "hide-today",
            "reflect": true,
            "defaultValue": "false"
        },
        "todayText": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "today-text",
            "reflect": true
        },
        "placeholder": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "placeholder",
            "reflect": true
        },
        "zIndex": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "z-index",
            "reflect": true,
            "defaultValue": "'99999'"
        },
        "disabled": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "disabled",
            "reflect": true,
            "defaultValue": "false"
        }
    }; }
    static get states() { return {
        "displayCalender": {},
        "calenderContainerId": {}
    }; }
    static get listeners() { return [{
            "name": "click",
            "method": "handleOnClickOutSide",
            "target": "window",
            "capture": false,
            "passive": false
        }]; }
}
