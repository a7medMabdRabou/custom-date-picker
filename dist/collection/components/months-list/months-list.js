import { h } from "@stencil/core";
import moment from 'moment-hijri';
export class YearsList {
    constructor() {
        this.months = [
            { number: 0, name: 'محرم' },
            { number: 1, name: 'صفر' },
            { number: 2, name: 'ربيع 1' },
            { number: 3, name: 'ربيع 2' },
            { number: 4, name: 'جمادي 1' },
            { number: 5, name: 'جمادي 2' },
            { number: 6, name: 'رجب' },
            { number: 7, name: 'شعبان' },
            { number: 8, name: 'رمضان' },
            { number: 9, name: 'شوال' },
            { number: 10, name: 'ذو القعدة' },
            { number: 11, name: 'ذو الحجة' },
        ];
    }
    render() {
        let monthsList = [];
        for (let i = 0; i < this.months.length; i++) {
            if (this.maxDate) {
                let maxDateMoment = moment(this.maxDate, 'iYYYY/iMM/iDD');
                if (this.currentTime.iYear() === maxDateMoment.iYear() && this.months[i].number > maxDateMoment.iMonth()) {
                    continue;
                }
            }
            monthsList.push(h("option", { key: this.months[i].number, value: this.months[i].number, selected: this.currentTime.iMonth() == this.months[i].number }, this.months[i].name));
        }
        return h("select", { class: "months-list", onChange: this.handleMonthChange }, monthsList);
    }
    static get is() { return "months-list"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["months-list.css"]
    }; }
    static get styleUrls() { return {
        "$": ["months-list.css"]
    }; }
    static get properties() { return {
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
        "handleMonthChange": {
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
            "attribute": "handle-month-change",
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
