import type { Document, FindOptions, Filter, SchemaMember } from 'mongodb';
import type { IRocketChatRecord } from './IRocketChatRecord';
import type { IRole } from './IRole';
import type { IUser } from './IUser';
export declare enum TEAM_TYPE {
    PUBLIC = 0,
    PRIVATE = 1
}
export type SortType = -1 | 1;
export interface ITeam extends IRocketChatRecord {
    name: string;
    type: TEAM_TYPE;
    roomId: string;
    createdBy: Pick<IUser, '_id' | 'username'>;
    createdAt: Date;
}
export interface ITeamMember extends IRocketChatRecord {
    teamId: string;
    userId: string;
    roles?: Array<IRole['_id']>;
    createdBy: Pick<IUser, '_id' | 'username'>;
    createdAt: Date;
}
export interface IPaginationOptions {
    offset: number;
    count: number;
}
export interface IQueryOptions<T extends Document> {
    sort?: FindOptions<T>['sort'];
    query?: Filter<T>;
    fields?: SchemaMember<T, number | boolean>;
}
export interface IRecordsWithTotal<T> {
    records: Array<T>;
    total: number;
}
export interface ITeamStats {
    totalTeams: number;
    totalRoomsInsideTeams: number;
    totalDefaultRoomsInsideTeams: number;
}
export interface ITeamMemberParams {
    userId: string;
    roles?: Array<IRole['_id']> | null;
}
