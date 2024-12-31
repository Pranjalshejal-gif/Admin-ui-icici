import { ResultColumn } from './result-column';

export class Report {
    id: number;
    name: string;
    title: string;
    query: string;
    subTitleTemplate: string;
    footerQuery?: string;
    headerQuery?: string;
    fileNameQuery?: string;
    inputFields: [];
    resultColumns: Array<ResultColumn>;
    suppressColumnCaptions: boolean;
}