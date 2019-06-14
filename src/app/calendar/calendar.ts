
export interface CalendarDayJson {
    start: number;
    end: number;
    pause: number;
    tasks: {[key: number]: number};
}

export interface CalendarMonthJson {
    day: {[key: number]: CalendarDayJson};
}

export interface CalendarJson {
    month: {[key: number]: CalendarMonthJson};
}
