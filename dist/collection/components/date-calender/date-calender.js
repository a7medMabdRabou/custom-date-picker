import { Component, Prop, h, State, Watch } from '@stencil/core';
import moment from 'moment-hijri';
import { parseHijriDate, getHijriDaysInMonth } from '../../utils/date-utils';
export class DateCalender {
    constructor() {
        this.arabicDayNames = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
        this.arabicFullDayNames = ['احد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'];
        this.englishDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        this.langCode = 'ar';
        this.dateFormat = 'iYYYY/iMM/iDD';
        this.selectedDate = '';
        this.disableFuture = false;
        this.disablePast = false;
        this.hideToday = false;
        this.subtractMonth = () => {
            let prev = this.currentTime.clone().subtract(1, 'iMonth');
            const maxDays = getHijriDaysInMonth(prev.iYear(), prev.iMonth());
            if (prev.iDate() > maxDays)
                prev.iDate(maxDays);
            this.currentTime = this.clampTimeToRange(prev);
        };
        this.addMonth = () => {
            let next = this.currentTime.clone().add(1, 'iMonth');
            const maxDays = getHijriDaysInMonth(next.iYear(), next.iMonth());
            if (next.iDate() > maxDays)
                next.iDate(maxDays);
            this.currentTime = this.clampTimeToRange(next);
        };
        this.setSelectedDate = (event) => {
            let time = this.currentTime.clone();
            time.iDate(parseInt(event.target.value, 10));
            const selectedDate = time.format(this.dateFormat);
            if (this.setParentSelectedDate) {
                this.setParentSelectedDate(selectedDate, true, true);
            }
        };
        this.handleYearChange = (event) => {
            const newYear = parseInt(event.target.value, 10);
            let time = this.currentTime.clone().iYear(newYear);
            const maxDays = getHijriDaysInMonth(time.iYear(), time.iMonth());
            if (time.iDate() > maxDays) {
                time.iDate(maxDays);
            }
            time = this.clampTimeToRange(time);
            this.currentTime = time;
        };
        this.handleMonthChange = (event) => {
            const newMonth = parseInt(event.target.value, 10);
            let time = this.currentTime.clone().iMonth(newMonth);
            const maxDays = getHijriDaysInMonth(time.iYear(), time.iMonth());
            if (time.iDate() > maxDays) {
                time.iDate(maxDays);
            }
            time = this.clampTimeToRange(time);
            this.currentTime = time;
        };
        this.selectToday = () => {
            if (!this.isTodayAllowed())
                return;
            this.currentTime = moment().add(1, 'day');
            const todayStr = this.currentTime.format(this.dateFormat);
            if (this.setParentSelectedDate) {
                this.setParentSelectedDate(todayStr, true, true);
            }
        };
    }
    componentWillLoad() {
        let initialTime = parseHijriDate(this.selectedDate, this.dateFormat) || moment();
        this.currentTime = this.clampTimeToRange(initialTime);
    }
    watchSelectedDate(newValue) {
        const parsed = parseHijriDate(newValue, this.dateFormat);
        if (parsed) {
            this.currentTime = this.clampTimeToRange(parsed);
        }
    }
    watchConstraints() {
        this.currentTime = this.clampTimeToRange(this.currentTime);
    }
    clampTimeToRange(time) {
        if (!time)
            time = moment();
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
    getEffectiveMaxDate() {
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
            if (!maxM)
                return todayStr;
            if (todayObj.isBefore(maxM, 'day')) {
                return todayStr;
            }
        }
        return effectiveMax;
    }
    getEffectiveMinDate() {
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
            if (!minM)
                return todayStr;
            if (todayObj.isAfter(minM, 'day')) {
                return todayStr;
            }
        }
        return effectiveMin;
    }
    isBeforeMinMonth() {
        const minStr = this.getEffectiveMinDate();
        if (!minStr || !this.currentTime)
            return false;
        const minM = parseHijriDate(minStr, this.dateFormat);
        if (!minM)
            return false;
        let prevMonth = this.currentTime.clone().subtract(1, 'iMonth');
        const maxDays = getHijriDaysInMonth(prevMonth.iYear(), prevMonth.iMonth());
        prevMonth.iDate(maxDays).startOf('day');
        return prevMonth.isBefore(minM, 'day');
    }
    isAfterMaxMonth() {
        const maxStr = this.getEffectiveMaxDate();
        if (!maxStr || !this.currentTime)
            return false;
        const maxM = parseHijriDate(maxStr, this.dateFormat);
        if (!maxM)
            return false;
        let nextMonth = this.currentTime.clone().add(1, 'iMonth').iDate(1).startOf('day');
        return nextMonth.isAfter(maxM, 'day');
    }
    getMonthName() {
        if (!this.currentTime)
            return '';
        return this.currentTime.format('iMMMM') + ' (' + this.currentTime.format('iMM') + ') ' + this.currentTime.format('iYYYY');
    }
    isTodayAllowed() {
        const todayObj = moment().add(1, 'day').startOf('day');
        const maxStr = this.getEffectiveMaxDate();
        const minStr = this.getEffectiveMinDate();
        if (maxStr) {
            const maxM = parseHijriDate(maxStr, this.dateFormat);
            if (maxM && todayObj.isAfter(maxM, 'day'))
                return false;
        }
        if (minStr) {
            const minM = parseHijriDate(minStr, this.dateFormat);
            if (minM && todayObj.isBefore(minM, 'day'))
                return false;
        }
        return true;
    }
    render() {
        const isTodayHidden = this.hideToday === true || this.hideToday === 'true' || this.hideToday === '' || this.hideToday === 'hide-today';
        const todayLabel = this.todayText || (this.langCode === 'ar' ? 'اليوم' : 'Today');
        const canSelectToday = this.isTodayAllowed();
        let todayBtnStyle = {};
        if (this.bgcolor)
            todayBtnStyle.backgroundColor = this.bgcolor;
        if (this.textColor)
            todayBtnStyle.color = this.textColor;
        return (h("div", { class: 'date-calender' },
            h("div", { class: 'date-calender-controls' },
                h("button", { class: 'control-button previous-button', onClick: this.subtractMonth, type: "button", disabled: this.isBeforeMinMonth() }, '<'),
                h("strong", { class: 'month-name' }, this.getMonthName()),
                h("button", { class: 'control-button next-button', onClick: this.addMonth, type: "button", disabled: this.isAfterMaxMonth() },
                    " ",
                    '>',
                    " "),
                h("div", null,
                    h("years-list", { currentTime: this.currentTime, handleYearChange: this.handleYearChange, maxDate: this.getEffectiveMaxDate(), minDate: this.getEffectiveMinDate(), dateFormat: this.dateFormat }),
                    h("months-list", { currentTime: this.currentTime, handleMonthChange: this.handleMonthChange, maxDate: this.getEffectiveMaxDate(), minDate: this.getEffectiveMinDate(), dateFormat: this.dateFormat }))),
            h("day-names", { langCode: this.langCode }),
            h("month-days", { currentTime: this.currentTime, dateFormat: this.dateFormat, selectedDate: this.selectedDate, setSelectedDate: this.setSelectedDate, maxDate: this.getEffectiveMaxDate(), minDate: this.getEffectiveMinDate(), bgcolor: this.bgcolor, selectedColor: this.selectedColor, textColor: this.textColor, selectedTextColor: this.selectedTextColor }),
            !isTodayHidden && (h("div", { class: 'date-calender-footer' },
                h("button", { class: `today-button ${!canSelectToday ? 'disabled' : ''}`, onClick: this.selectToday, type: "button", disabled: !canSelectToday, style: todayBtnStyle }, todayLabel)))));
    }
    static get is() { return "date-calender"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["date-calender.css"]
    }; }
    static get styleUrls() { return {
        "$": ["date-calender.css"]
    }; }
    static get properties() { return {
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
        "setParentSelectedDate": {
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
            "attribute": "set-parent-selected-date",
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
        }
    }; }
    static get states() { return {
        "currentTime": {}
    }; }
    static get watchers() { return [{
            "propName": "selectedDate",
            "methodName": "watchSelectedDate"
        }, {
            "propName": "minDate",
            "methodName": "watchConstraints"
        }, {
            "propName": "min",
            "methodName": "watchConstraints"
        }, {
            "propName": "maxDate",
            "methodName": "watchConstraints"
        }, {
            "propName": "max",
            "methodName": "watchConstraints"
        }, {
            "propName": "disableFuture",
            "methodName": "watchConstraints"
        }, {
            "propName": "disablePast",
            "methodName": "watchConstraints"
        }]; }
}
