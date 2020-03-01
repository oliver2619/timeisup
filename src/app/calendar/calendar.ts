export interface CalendarEventJson {
    event: number;
    time: number;
}

export interface CalendarDayJson {
    startWork: number;
    endWork: number;
    paused: number;
    accountableWorkingTime: number;
    tasks: {[key: number]: number};
    events: CalendarEventJson[];
    comments: {[key: number]: string};
}

export interface CalendarMonthJson {
    day: {[key: number]: CalendarDayJson};
}

export interface CalendarJson {
    version?: number;
    month: {[key: number]: CalendarMonthJson};
    roundingBonus: number;
}
