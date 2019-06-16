
export interface TimeControlJson {
    endWork?: number;
    startWork?: number;
    startPause?: number;
    paused?: number;
    firstPause?: number;
    currentTask?: number;
    startTask?: number;
    tasks: {[key: number]: number};
}

export class TimeControl {
    
}