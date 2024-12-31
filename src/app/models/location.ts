export class Location {
    stateId: string;
    cityId: string;
    stateName: string;
    cityName: string;
    bufferZone: number;

    constructor(stateId: string, cityId: string, stateName: string, cityName: string, bufferZone: number) {
        this.stateId = stateId;
        this.cityId = cityId;
        this.stateName = stateName;
        this.cityName = cityName;
        this.bufferZone = bufferZone;
    }
}   