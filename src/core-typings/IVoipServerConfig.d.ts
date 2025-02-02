import type { ICallServerConfigData } from './voip';
export declare enum ServerType {
    MANAGEMENT = "management",
    CALL_SERVER = "call-server"
}
export interface IVoipServerConfigBase {
    type: ServerType;
    name: string;
}
export interface IVoipCallServerConfig extends IVoipServerConfigBase {
    type: ServerType.CALL_SERVER;
    configData: ICallServerConfigData;
}
export interface IVoipManagementServerConfig extends IVoipServerConfigBase {
    type: ServerType.MANAGEMENT;
    host: string;
    configData: IManagementConfigData;
}
export interface IManagementConfigData {
    port: number;
    username: string;
    password: string;
}
export declare const isICallServerConfigData: (obj: any) => obj is ICallServerConfigData;
