export declare const STANDARD_HIJRI_FORMATS: string[];
/**
 * Safely get the number of days in a Hijri month.
 * Avoids the parseInt NaN bug on Arabic numerals in moment().iDaysInMonth().
 */
export declare function getHijriDaysInMonth(year: number, monthZeroIndexed: number): number;
/**
 * Robustly parses any Hijri date string into a Moment object.
 * Handles:
 * - Standard moment parsing
 * - Day clamping for months with 29 days (e.g. 1446/12/30 -> 1446/12/29)
 * - YYYY/MM/DD, YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY
 */
export declare function parseHijriDate(dateStr: any, preferredFormat?: string): any;
