
export interface CalendarDayJson {
    startWork: number;
    endWork: number;
    startPause: number;
    endPause: number;
    tasks: {[key: number]: number};
}

export interface CalendarMonthJson {
    day: {[key: number]: CalendarDayJson};
}

export interface CalendarJson {
    month: {[key: number]: CalendarMonthJson};
}
