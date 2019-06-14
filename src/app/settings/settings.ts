
export interface WorkSettingsJson {
    hoursPerWeek: number;
    workingRate: number;
    granularity: number;
    mo_fr: boolean;
    sa: boolean;
    su: boolean;
}

export interface SettingsJson {
    work: WorkSettingsJson;
}