export enum TimeControlEventType {
    PAUSE, TASK, EVENT
}

export interface TimeControlEventJson {
    type: TimeControlEventType;
    start: number;
    end?: number;
    id?: number;
}

export interface TimeControlJson {
    endWork?: number;
    startWork?: number;
    events: TimeControlEventJson[];
}
