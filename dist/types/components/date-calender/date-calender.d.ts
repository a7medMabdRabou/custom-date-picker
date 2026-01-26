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
    disableFuture: boolean;
    currentTime: any;
    watchHandler(newValue: string): void;
    subtractMonth: () => void;
    addMonth: () => void;
    setSelectedDate: (event: any) => void;
    getEffectiveMaxDate(): string;
    isAfterMaxMonth(): any;
    getMonthStartDayName(): any;
    getMonthName(): string;
    handleYearChange: (event: any) => void;
    handleMonthChange: (event: any) => void;
    render(): any;
}
