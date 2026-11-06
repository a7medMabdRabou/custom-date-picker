import { Component, Prop, h } from '@stencil/core';
import moment from 'moment-hijri';
export class MonthDays {
    constructor() {
        this.englishDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
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
    getMonthStartDayName() {
        let time = this.currentTime.clone();
        time.startOf('iMonth');
        return time.format('dd');
    }
    monthDays() {
        return this.currentTime.iDaysInMonth();
    }
    isSelectedDate(i) {
        if (!this.selectedDate)
            return false;
        let time = this.currentTime.clone();
        time.iDate(parseInt(i, 10));
        const selected = moment(this.selectedDate, this.getFormats(), true);
        if (!selected.isValid())
            return false;
        return time.isSame(selected, 'day');
    }
    isAfterMaxDate(i) {
        if (!this.maxDate)
            return false;
        let dayMoment = this.currentTime.clone();
        dayMoment.iDate(parseInt(i, 10));
        // Parse the max date string
        let maxMoment = moment(this.maxDate, this.getFormats(), true);
        if (!maxMoment.isValid())
            return false;
        return dayMoment.isAfter(maxMoment, 'day');
    }
    render() {
        let daysList = [];
        for (let i = this.englishDayNames.indexOf(this.getMonthStartDayName()); i > 0; i--) {
            daysList.push(h("div", { class: 'month-day no-hover', key: daysList.length.toString() }));
        }
        for (let i = 1; i < this.monthDays() + 1; i++) {
            const isFuture = this.isAfterMaxDate(i);
            daysList.push(h("div", { class: 'month-day ' + (this.isSelectedDate(i) ? 'selected' : '') + (isFuture ? ' disabled' : ''), key: daysList.length.toString() },
                h("button", { class: 'month-day-button ' + (this.isSelectedDate(i) ? 'selected' : '') + (isFuture ? ' disabled' : ''), onClick: this.setSelectedDate, value: i, type: "button", disabled: isFuture }, i)));
        }
        return h("div", { class: 'month-days' }, daysList);
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
        }
    }; }
}
