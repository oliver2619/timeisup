
export interface EventJson {
    id: number;

    name: string;
}

export interface EventListJson {

    nextId: number;

    events: EventJson[];

}