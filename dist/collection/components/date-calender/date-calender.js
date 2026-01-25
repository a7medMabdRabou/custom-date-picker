import { h } from "@stencil/core";
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
        this.currentTime = moment(this.selectedDate, this.dateFormat);
        this.subtractMonth = () => {
            let currentTime = moment(this.currentTime.format(this.dateFormat), this.dateFormat);
            this.currentTime = currentTime.subtract(1, 'iMonth');
        };
        this.addMonth = () => {
            let currentTime = moment(this.currentTime.format(this.dateFormat), this.dateFormat);
            this.currentTime = currentTime.add(1, 'iMonth');
        };
        this.setSelectedDate = (event) => {
            let time = this.currentTime;
            time.iDate(parseInt(event.target.value, 10));
            const selectedDate = time.format(this.dateFormat);
            this.selectedDate = selectedDate;
            this.setParentSelectedDate(this.selectedDate);
        };
        this.handleYearChange = (event) => {
            let time = this.currentTime;
            time.iYear(parseInt(event.target.value, 10));
            const selectedDate = time.format(this.dateFormat);
            this.selectedDate = selectedDate;
        };
        this.handleMonthChange = (event) => {
            let time = this.currentTime;
            time.iMonth(parseInt(event.target.value, 10));
            const selectedDate = time.format(this.dateFormat);
            this.selectedDate = selectedDate;
        };
    }
    watchHandler(newValue) {
        this.currentTime = moment(newValue, this.dateFormat);
    }
    isAfterMaxMonth() {
        if (!this.maxDate)
            return false;
        let nextMonth = moment(this.currentTime.format(this.dateFormat), this.dateFormat).add(1, 'iMonth').startOf('iMonth');
        return nextMonth.isAfter(moment(this.maxDate, this.dateFormat), 'day');
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
        return h("div", { class: 'date-calender' },
            h("div", { class: 'date-calender-controls' },
                h("button", { class: 'control-button previous-button', onClick: this.subtractMonth, type: "button" }, '<'),
                h("strong", { class: 'month-name' }, this.getMonthName()),
                h("button", { class: 'control-button next-button', onClick: this.addMonth, type: "button", disabled: this.isAfterMaxMonth() },
                    " ",
                    '>',
                    " "),
                h("div", null,
                    h("years-list", { currentTime: this.currentTime, handleYearChange: this.handleYearChange, maxDate: this.maxDate }),
                    h("months-list", { currentTime: this.currentTime, handleMonthChange: this.handleMonthChange, maxDate: this.maxDate }))),
            h("day-names", { langCode: this.langCode }),
            h("month-days", { currentTime: this.currentTime, dateFormat: this.dateFormat, selectedDate: this.selectedDate, setSelectedDate: this.setSelectedDate, maxDate: this.maxDate }));
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
