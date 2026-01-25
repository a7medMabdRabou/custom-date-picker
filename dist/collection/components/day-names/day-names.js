import { h } from "@stencil/core";
export class DayNames {
    constructor() {
        this.arabicDayNames = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
        this.arabicFullDayNames = ['احد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'];
        this.englishDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        /**
         * The language code
         */
        this.langCode = 'ar';
    }
    componentWillLoad() {
        if (this.langCode == 'ar')
            this.selectedDayNames = this.arabicDayNames;
        else
            this.selectedDayNames = this.englishDayNames;
    }
    render() {
        return h("div", { class: 'day-names-container' }, this.selectedDayNames.map((item, key) => h("div", { class: "day-name", key: key.toString() }, item)));
    }
    static get is() { return "day-names"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["day-names.css"]
    }; }
    static get styleUrls() { return {
        "$": ["day-names.css"]
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
            "reflect": false,
            "defaultValue": "'ar'"
        }
    }; }
    static get states() { return {
        "selectedDayNames": {}
    }; }
}
