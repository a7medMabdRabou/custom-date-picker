import { Component, Prop, h } from '@stencil/core';
import { parseHijriDate } from '../../utils/date-utils';
export class YearsList {
    constructor() {
        this.minYear = 1356;
        this.maxYear = 1500;
        this.dateFormat = 'iYYYY/iMM/iDD';
    }
    render() {
        let yearsList = [];
        let maxYear = this.maxYear;
        let minYear = this.minYear;
        if (this.maxDate) {
            const maxM = parseHijriDate(this.maxDate, this.dateFormat);
            if (maxM) {
                maxYear = maxM.iYear();
            }
        }
        if (this.minDate) {
            const minM = parseHijriDate(this.minDate, this.dateFormat);
            if (minM) {
                minYear = minM.iYear();
            }
        }
        if (minYear > maxYear) {
            const tmp = minYear;
            minYear = maxYear;
            maxYear = tmp;
        }
        const currentYear = this.currentTime ? this.currentTime.iYear() : minYear;
        for (let i = minYear; i <= maxYear; i++) {
            yearsList.push(h("option", { key: i, value: i, selected: currentYear === i }, i));
        }
        return (h("select", { class: "years-list", onChange: this.handleYearChange }, yearsList));
    }
    static get is() { return "years-list"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["years-list.css"]
    }; }
    static get styleUrls() { return {
        "$": ["years-list.css"]
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
        "handleYearChange": {
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
            "attribute": "handle-year-change",
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
            "reflect": false
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
            "reflect": false,
            "defaultValue": "'iYYYY/iMM/iDD'"
        }
    }; }
}
