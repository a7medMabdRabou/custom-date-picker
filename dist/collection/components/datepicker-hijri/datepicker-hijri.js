import { Component, Listen, h, State, Prop } from '@stencil/core';
import Popper from 'popper.js';
import uuid from 'uuid';
import moment from 'moment-hijri';
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
    handleOnfocus() {
        if (this.disabled === true || this.disabled === 'true' || this.disabled === '')
            return;
        const reference = document.querySelector('#' + this.reference);
        if (reference) {
            const m = moment(reference.value, this.getSupportedFormats(), true);
            if (m && m.isValid && m.isValid()) {
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
        // React/MUI may render the input after this component; retry until reference exists
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
        return h("div", { id: this.calenderContainerId, style: { 'visibility': this.displayCalender ? 'visible' : 'hidden', 'z-index': this.zIndex || '99999', 'margin': '5px' } },
            h("date-calender", { langCode: this.langCode, dateFormat: this.dateFormat, selectedDate: this.selectedDate, setParentSelectedDate: this.setSelectedDate, maxDate: this.maxDate, minDate: this.minDate, disableFuture: this.disableFuture, disablePast: this.disablePast, bgcolor: this.getEffectiveBgColor(), selectedColor: this.selectedColor, textColor: this.textColor, selectedTextColor: this.selectedTextColor, hideToday: this.hideToday, todayText: this.todayText }));
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
