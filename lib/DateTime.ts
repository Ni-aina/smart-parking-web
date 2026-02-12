import { keyFilter } from "@/types/global";

const FIRST_DAY_OF_YEAR = new Date(new Date().getFullYear(), 0, 1);
const FIRST_DAY_OF_MONTH = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const FIRST_DAY_OF_WEEK = new Date();
FIRST_DAY_OF_WEEK.setDate(FIRST_DAY_OF_WEEK.getDate() - FIRST_DAY_OF_WEEK.getDay());

const PREVIOUS_FIRST_DAY_OF_YEAR = new Date(new Date().getFullYear() - 1, 0, 1);
const PREVIOUS_FIRST_DAY_OF_MONTH = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
const PREVIOUS_FIRST_DAY_OF_WEEK = new Date(FIRST_DAY_OF_WEEK);
PREVIOUS_FIRST_DAY_OF_WEEK.setDate(PREVIOUS_FIRST_DAY_OF_WEEK.getDate() - 7);

export const getFilterDates = (filter: keyFilter): {
    firstDay: Date;
    previousFirstDay: Date;
} => {
    switch (filter) {
        case "this-year":
            return {
                firstDay: FIRST_DAY_OF_YEAR,
                previousFirstDay: PREVIOUS_FIRST_DAY_OF_YEAR
            }
        case "this-month":
            return {
                firstDay: FIRST_DAY_OF_MONTH,
                previousFirstDay: PREVIOUS_FIRST_DAY_OF_MONTH
            }
        case "this-week":
            return {
                firstDay: FIRST_DAY_OF_WEEK,
                previousFirstDay: PREVIOUS_FIRST_DAY_OF_WEEK
            }
        default:
            return {
                firstDay: FIRST_DAY_OF_YEAR,
                previousFirstDay: PREVIOUS_FIRST_DAY_OF_YEAR
            }
    }
}