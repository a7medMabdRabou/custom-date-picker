import { Component, Prop, h } from '@stencil/core';
import { parseHijriDate, getHijriDaysInMonth } from '../../utils/date-utils';
export class MonthDays {
    constructor() {
        this.englishDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    }
    getMonthStartDayName() {
        let time = this.currentTime.clone();
        time.startOf('iMonth');
        return time.format('dd');
    }
    monthDays() {
        if (!this.currentTime)
            return 30;
        return getHijriDaysInMonth(this.currentTime.iYear(), this.currentTime.iMonth());
    }
    isSelectedDate(i) {
        if (!this.selectedDate || !this.currentTime)
            return false;
        const selected = parseHijriDate(this.selectedDate, this.dateFormat);
        if (!selected)
            return false;
        let dayMoment = this.currentTime.clone().iDate(parseInt(i, 10)).startOf('day');
        return dayMoment.isSame(selected, 'day');
    }
    isAfterMaxDate(i) {
        if (!this.maxDate || !this.currentTime)
            return false;
        const maxMoment = parseHijriDate(this.maxDate, this.dateFormat);
        if (!maxMoment)
            return false;
        let dayMoment = this.currentTime.clone().iDate(parseInt(i, 10)).startOf('day');
        return dayMoment.isAfter(maxMoment, 'day');
    }
    isBeforeMinDate(i) {
        if (!this.minDate || !this.currentTime)
            return false;
        const minMoment = parseHijriDate(this.minDate, this.dateFormat);
        if (!minMoment)
            return false;
        let dayMoment = this.currentTime.clone().iDate(parseInt(i, 10)).startOf('day');
        return dayMoment.isBefore(minMoment, 'day');
    }
    render() {
        let daysList = [];
        for (let i = this.englishDayNames.indexOf(this.getMonthStartDayName()); i > 0; i--) {
            daysList.push(h("div", { class: 'month-day no-hover', key: daysList.length.toString() }));
        }
        const totalDays = this.monthDays();
        for (let i = 1; i <= totalDays; i++) {
            const isFuture = this.isAfterMaxDate(i);
            const isPastDisabled = this.isBeforeMinDate(i);
            const isDisabled = isFuture || isPastDisabled;
            const isSelected = this.isSelectedDate(i);
            let btnStyle = {};
            if (isSelected && this.selectedColor) {
                btnStyle.backgroundColor = this.selectedColor;
            }
            else if (!isSelected && !isDisabled && this.bgcolor) {
                btnStyle.backgroundColor = this.bgcolor;
            }
            if (isSelected && this.selectedTextColor) {
                btnStyle.color = this.selectedTextColor;
            }
            else if (this.textColor) {
                btnStyle.color = this.textColor;
            }
            daysList.push(h("button", { class: `month-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`, type: 'button', disabled: isDisabled, style: btnStyle, onClick: this.setSelectedDate, value: i }, i));
        }
        return (h("div", { class: 'month-days' }, daysList));
    }
    static get is() { return "month-days"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["month-days.css"]
    }; }
    static get styleUrls() { return {
        "$": ["month-days.css"]
    }; }
    static get properties() { return {
        "setSelectedDate": {
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
            "attribute": "set-selected-date",
            "reflect": false
        },
        "currentTime": {
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
            "attribute": "current-time",
            "reflect": false
        },
        "dateFormat": {
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
            "attribute": "date-format",
            "reflect": false
        },
        "selectedDate": {
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
            "attribute": "selected-date",
            "reflect": false
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
            "reflect": false
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
        }
    }; }
}
