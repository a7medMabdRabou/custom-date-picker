import { h } from "@stencil/core";
import Popper from 'popper.js';
import uuid from 'uuid';
import moment from 'moment-hijri';
export class DatepickerHijri {
    constructor() {
        this.placement = 'bottom';
        this.selectedDate = '';
        this.langCode = 'ar';
        this.dateFormat = 'iYYYY/iMM/iDD';
        this.onDateSelectClose = false;
        this.disableFuture = false;
        this.displayCalender = false;
        this.setSelectedDate = (selectedDate, triggerEvent = true) => {
            this.selectedDate = selectedDate;
            var reference = document.querySelector('#' + this.reference);
            reference.setAttribute('value', this.selectedDate);
            reference.value = this.selectedDate;
            if (triggerEvent)
                reference.dispatchEvent(new Event('change'));
            if (this.onDateSelectClose)
                this.displayCalender = false;
        };
    }
    handleOnfocus() {
        const reference = document.querySelector('#' + this.reference);
        if (reference && moment(reference.value, this.dateFormat)._isValid) {
            this.selectedDate = reference.value;
        }
        this.displayCalender = true;
    }
    handleOnClickOutSide(e) {
        if (!this.hasSomeParentId(e.target, this.calenderContainerId) && !(e.target.id == this.reference))
            this.displayCalender = false;
    }
    // Check if the element
    hasSomeParentId(element, idName) {
        //
        // If we are here we didn't find the searched class in any parents node
        //
        if (!element.parentNode)
            return false;
        //
        // If the current node has the class return true, otherwise we will search
        // it in the parent node
        //
        if (element.id == idName)
            return true;
        return this.hasSomeParentId(element.parentNode, idName);
    }
    componentWillLoad() {
        this.calenderContainerId = uuid('datepicker-hijri');
        // This will fix the datepicker when the selected date is null or empty
        if (!moment(this.selectedDate, this.dateFormat)._isValid) {
            var selectedDate;
            if (!moment(document.querySelector('#' + this.reference).getAttribute('value'), this.dateFormat)._isValid) {
                selectedDate = moment().format(this.dateFormat);
            }
            else {
                selectedDate = document.querySelector('#' + this.reference).getAttribute('value');
            }
            this.selectedDate = selectedDate;
            this.setSelectedDate(this.selectedDate, false);
        }
    }
    componentDidLoad() {
        var reference = document.querySelector('#' + this.reference);
        reference.addEventListener('focus', () => this.handleOnfocus());
        reference.addEventListener('click', () => this.handleOnfocus());
        var popperEl = document.getElementById(this.calenderContainerId);
        new Popper(reference, popperEl, {
            placement: this.placement
        });
    }
    render() {
        return h("div", { id: this.calenderContainerId, style: { 'visibility': this.displayCalender ? 'visible' : 'hidden', 'z-index': '99999', 'margin': '5px' } },
            h("date-calender", { langCode: this.langCode, dateFormat: this.dateFormat, selectedDate: this.selectedDate, setParentSelectedDate: this.setSelectedDate, maxDate: this.maxDate, disableFuture: this.disableFuture }));
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
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
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
            "defaultValue": "false"
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
