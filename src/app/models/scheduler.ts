import { Task } from "./task"

export class Scheduler {
    id: string;
    scheduleDesc: string;
    taskInterval: string;
    intervalUnit: number;
    nextExecDateTime: number;
    executionCount: number;
    active: string;
    tasks: Array<Task>;
    deliveryType: string;
    emailFrom: string;
    emailTo: string;
    emailCc: string;
    emailContent: string;
    lastDate: any;
    ftpHost: any;
    ftpPort: any;
    ftpUser: any;
    ftpPassword: any;
    ftpRemoteDir: any;
    emailPassword: any;
}