import { Component, Prop, h, State, Watch } from '@stencil/core';
import moment from 'moment-hijri';
export class DateCalender {
    constructor() {
        this.arabicDayNames = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
        this.arabicFullDayNames = ['احد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'];
        this.englishDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        /**
         * The language code
         */
        this.langCode = 'ar';
        this.dateFormat = 'iYYYY/iMM/iDD';
        this.selectedDate = '';
        this.disableFuture = false;
        this.subtractMonth = () => {
            this.currentTime = this.currentTime.clone().subtract(1, 'iMonth');
        };
        this.addMonth = () => {
            this.currentTime = this.currentTime.clone().add(1, 'iMonth');
        };
        this.setSelectedDate = (event) => {
            let time = this.currentTime.clone();
            time.iDate(parseInt(event.target.value, 10));
            const selectedDate = time.format(this.dateFormat);
            // We shouldn't mutate the prop directly if not intended, but keeping consistent with existing logic pattern
            // However, setParentSelectedDate is the key.
            if (this.setParentSelectedDate) {
                this.setParentSelectedDate(selectedDate, true, true);
            }
        };
        this.handleYearChange = (event) => {
            // Clone to avoid mutating state directly
            let time = this.currentTime.clone();
            time.iYear(parseInt(event.target.value, 10));
            const selectedDate = time.format(this.dateFormat);
            if (this.setParentSelectedDate) {
                this.setParentSelectedDate(selectedDate, true, false);
            }
        };
        this.handleMonthChange = (event) => {
            let time = this.currentTime.clone();
            time.iMonth(parseInt(event.target.value, 10));
            const selectedDate = time.format(this.dateFormat);
            if (this.setParentSelectedDate) {
                this.setParentSelectedDate(selectedDate, true, false);
            }
        };
        this.selectToday = () => {
            // 1. Set current time to today
            // Fix: User reported Hijri date is 1 day behind. Adding 1 day to match observation.
            this.currentTime = moment().add(1, 'day');
            // 2. Format it according to the requested format
            const todayStr = this.currentTime.format(this.dateFormat);
            // 3. Update parent
            if (this.setParentSelectedDate) {
                this.setParentSelectedDate(todayStr, true, true);
            }
        };
    }
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
        if (!dateStr)
            return moment();
        const m = moment(dateStr, this.getFormats(), true);
        return m.isValid() ? m : moment();
    }
    watchHandler(newValue) {
        this.currentTime = this.getMoment(newValue);
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
            if (!maxMoment.isValid())
                return today;
            if (todayMoment.isBefore(maxMoment, 'day')) {
                return today;
            }
        }
        return effectiveMaxDate;
    }
    isAfterMaxMonth() {
        const effectiveMaxDate = this.getEffectiveMaxDate();
        if (!effectiveMaxDate)
            return false;
        // Check if the max date is valid
        const maxDateMoment = moment(effectiveMaxDate, this.getFormats(), true);
        if (!maxDateMoment.isValid())
            return false;
        let nextMonth = this.currentTime.clone().add(1, 'iMonth').startOf('iMonth');
        return nextMonth.isAfter(maxDateMoment, 'day');
    }
    getMonthStartDayName() {
        let time = this.currentTime;
        time.startOf('iMonth');
        return time.format('dd');
    }
    getMonthName() {
        return this.currentTime.format('iMMMM') + ' (' + this.currentTime.format('iMM') + ') ' + this.currentTime.format('iYYYY');
    }
    render() {
        const todayLabel = this.langCode === 'ar' ? 'اليوم' : 'Today';
        return h("div", { class: 'date-calender' },
            h("div", { class: 'date-calender-controls' },
                h("button", { class: 'control-button previous-button', onClick: this.subtractMonth, type: "button" }, '<'),
                h("strong", { class: 'month-name' }, this.getMonthName()),
                h("button", { class: 'control-button next-button', onClick: this.addMonth, type: "button", disabled: this.isAfterMaxMonth() },
                    " ",
                    '>',
                    " "),
                h("div", null,
                    h("years-list", { currentTime: this.currentTime, handleYearChange: this.handleYearChange, maxDate: this.getEffectiveMaxDate(), dateFormat: this.dateFormat }),
                    h("months-list", { currentTime: this.currentTime, handleMonthChange: this.handleMonthChange, maxDate: this.getEffectiveMaxDate(), dateFormat: this.dateFormat }))),
            h("day-names", { langCode: this.langCode }),
            h("month-days", { currentTime: this.currentTime, dateFormat: this.dateFormat, selectedDate: this.selectedDate, setSelectedDate: this.setSelectedDate, maxDate: this.getEffectiveMaxDate(), bgcolor: this.bgcolor, selectedColor: this.selectedColor }),
            h("div", { class: 'date-calender-footer' },
                h("button", { class: 'today-button', onClick: this.selectToday, type: "button", style: this.bgcolor ? { backgroundColor: this.bgcolor } : {} }, todayLabel)));
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
                "text": "The language code"
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
        }
    }; }
    static get states() { return {
        "currentTime": {}
    }; }
    static get watchers() { return [{
            "propName": "selectedDate",
            "methodName": "watchHandler"
        }]; }
}
