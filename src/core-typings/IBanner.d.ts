import type * as UiKit from '@rocket.chat/ui-kit';
import type { IRocketChatRecord } from './IRocketChatRecord';
import type { IUser } from './IUser';
export declare enum BannerPlatform {
    Web = "web",
    Mobile = "mobile"
}
type Dictionary = {
    [lng: string]: {
        [key: string]: string;
    };
};
export interface IBanner extends IRocketChatRecord {
    platform: BannerPlatform[];
    expireAt: Date;
    startAt: Date;
    /** @deprecated a new `selector` field should be created for filtering instead */
    roles?: string[];
    createdBy: Pick<IUser, '_id' | 'username'>;
    createdAt: Date;
    view: UiKit.BannerView;
    active?: boolean;
    inactivedAt?: Date;
    snapshot?: string;
    dictionary?: Dictionary;
    surface: 'banner' | 'modal';
}
export type InactiveBanner = IBanner & {
    active: false;
    inactivedAt: Date;
};
export declare const isInactiveBanner: (banner: IBanner) => banner is InactiveBanner;
export interface IBannerDismiss extends IRocketChatRecord {
    userId: IUser['_id'];
    bannerId: IBanner['_id'];
    dismissedAt: Date;
    dismissedBy: Pick<IUser, '_id' | 'username'>;
}
export {};
