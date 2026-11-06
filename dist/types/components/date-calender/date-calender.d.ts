export declare class DateCalender {
    arabicDayNames: string[];
    arabicFullDayNames: string[];
    englishDayNames: string[];
    /**
     * The language code
     */
    langCode: string;
    dateFormat: string;
    selectedDate: string;
    setParentSelectedDate: any;
    maxDate: string;
    disableFuture: any;
    bgcolor: string;
    selectedColor: string;
    currentTime: any;
    componentWillLoad(): void;
    getFormats(): string[];
    getMoment(dateStr: any): any;
    watchHandler(newValue: string): void;
    subtractMonth: () => void;
    addMonth: () => void;
    setSelectedDate: (event: any) => void;
    getEffectiveMaxDate(): any;
    isAfterMaxMonth(): any;
    getMonthStartDayName(): any;
    getMonthName(): string;
    handleYearChange: (event: any) => void;
    handleMonthChange: (event: any) => void;
    selectToday: () => void;
    render(): any;
}
