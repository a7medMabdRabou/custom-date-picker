import moment from 'moment-hijri';

export const STANDARD_HIJRI_FORMATS = [
  'iYYYY/iMM/iDD',
  'iYYYY-iMM-iDD',
  'iYYYY/iM/iD',
  'iYYYY-iM-iD',
  'iDD/iMM/iYYYY',
  'iDD-iMM-iYYYY',
  'iD/iM/iYYYY',
  'iD-iM-iYYYY'
];

/**
 * Safely get the number of days in a Hijri month.
 * Avoids the parseInt NaN bug on Arabic numerals in moment().iDaysInMonth().
 */
export function getHijriDaysInMonth(year: number, monthZeroIndexed: number): number {
  try {
    const days = (moment as any).iDaysInMonth(year, monthZeroIndexed);
    if (typeof days === 'number' && !isNaN(days) && days > 0) {
      return days;
    }
  } catch (e) {}
  return 30;
}

/**
 * Robustly parses any Hijri date string into a Moment object.
 * Handles:
 * - Standard moment parsing
 * - Day clamping for months with 29 days (e.g. 1446/12/30 -> 1446/12/29)
 * - YYYY/MM/DD, YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY
 */
export function parseHijriDate(dateStr: any, preferredFormat?: string): any {
  if (!dateStr) return null;
  const str = ('' + dateStr).trim();
  if (!str) return null;

  // 1. Regex extraction for YYYY/MM/DD or YYYY-MM-DD
  const ymdMatch = str.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (ymdMatch) {
    const y = parseInt(ymdMatch[1], 10);
    const mIndex = parseInt(ymdMatch[2], 10) - 1;
    let d = parseInt(ymdMatch[3], 10);
    if (mIndex >= 0 && mIndex < 12 && y >= 1300 && y <= 1600) {
      const maxDays = getHijriDaysInMonth(y, mIndex);
      if (d > maxDays) d = maxDays;
      if (d < 1) d = 1;
      const res = moment().iYear(y).iMonth(mIndex).iDate(d).startOf('day');
      if (res && res.isValid && res.isValid()) return res;
    }
  }

  // 2. Regex extraction for DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    let d = parseInt(dmyMatch[1], 10);
    const mIndex = parseInt(dmyMatch[2], 10) - 1;
    const y = parseInt(dmyMatch[3], 10);
    if (mIndex >= 0 && mIndex < 12 && y >= 1300 && y <= 1600) {
      const maxDays = getHijriDaysInMonth(y, mIndex);
      if (d > maxDays) d = maxDays;
      if (d < 1) d = 1;
      const res = moment().iYear(y).iMonth(mIndex).iDate(d).startOf('day');
      if (res && res.isValid && res.isValid()) return res;
    }
  }

  // 3. Preferred format
  if (preferredFormat) {
    try {
      const m = moment(str, preferredFormat, true);
      if (m && m.isValid && m.isValid()) return m.startOf('day');
    } catch (e) {}
  }

  // 4. Standard formats individually
  for (const fmt of STANDARD_HIJRI_FORMATS) {
    try {
      const m = moment(str, fmt, true);
      if (m && m.isValid && m.isValid()) return m.startOf('day');
    } catch (e) {}
  }

  return null;
}
