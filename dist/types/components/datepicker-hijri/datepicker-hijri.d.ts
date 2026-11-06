import { Placement } from 'popper.js';
export declare class DatepickerHijri {
    placement: Placement;
    reference: string;
    selectedDate: string;
    langCode: string;
    dateFormat: string;
    onDateSelectClose: any;
    maxDate: string;
    disableFuture: any;
    displayCalender: boolean;
    calenderContainerId: string;
    private shouldCloseOnDateSelect;
    getSupportedFormats(): string[];
    handleOnfocus(): void;
    private isClickOnReference;
    private isClickInsideCalender;
    handleOnClickOutSide(e: MouseEvent): void;
    hasSomeParentId(element: any, idName: any): any;
    setSelectedDate: (selectedDate: any, triggerEvent?: boolean, closePicker?: boolean) => void;
    componentWillLoad(): void;
    private attachToReference;
    componentDidLoad(): void;
    render(): any;
}
