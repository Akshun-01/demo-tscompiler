import type { IRocketChatRecord } from './IRocketChatRecord';
export interface IAppsTokens extends IRocketChatRecord {
    token: {
        apn: string;
    } | {
        gcm: string;
    };
    authToken: string;
    appName: string;
    userId: string | null;
    metadata: Record<string, any>;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
