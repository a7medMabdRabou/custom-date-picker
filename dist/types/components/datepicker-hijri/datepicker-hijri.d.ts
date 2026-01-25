import { Placement } from 'popper.js';
export declare class DatepickerHijri {
    placement: Placement;
    reference: string;
    selectedDate: string;
    langCode: string;
    dateFormat: string;
    onDateSelectClose: boolean;
    maxDate: string;
    displayCalender: boolean;
    calenderContainerId: string;
    handleOnfocus(): void;
    handleOnClickOutSide(e: any): void;
    hasSomeParentId(element: any, idName: any): any;
    setSelectedDate: (selectedDate: any, triggerEvent?: boolean) => void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): any;
}
