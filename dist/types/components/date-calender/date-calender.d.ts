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
    currentTime: any;
    subtractMonth: () => void;
    addMonth: () => void;
    setSelectedDate: (event: any) => void;
    isAfterMaxMonth(): any;
    getMonthStartDayName(): any;
    getMonthName(): string;
    handleYearChange: (event: any) => void;
    handleMonthChange: (event: any) => void;
    render(): any;
}
