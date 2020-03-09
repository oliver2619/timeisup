
export interface WorkSettingsJson {
    hoursPerWeek: number;
    workingRate: number;
    granularity: number;
    maxHoursPerDay: number;
    minMinutesBreak: number;
    mo_fr: boolean;
    sa: boolean;
    su: boolean;
}

export interface SettingsJson {
    version?: number;
    work: WorkSettingsJson;
}