export interface VoIPUserConfiguration {
    /**
     * Authorization username.
     * @defaultValue `""`
     */
    authUserName: string;
    /**
     * Authorization password.
     * @defaultValue `""`
     */
    authPassword: string;
    /**
     * SIP Registrar address.
     * @defaultValue `""`
     */
    sipRegistrarHostnameOrIP: string;
    /**
     * SIP WebSocket Path
     * @defaultValue `""`
     */
    webSocketURI?: string;
    /**
     * Option to turn on video
     * @defaultValue undefined
     */
    enableVideo?: boolean;
    /**
     * ConnectionDelegate
     * @defaultValue null
     */
    /**
     * ICE Server Array
     * @defaultValue undefined
     */
    iceServers: Array<object>;
    /**
     * Voip Retry count
     * @defaultValue undefined
     */
    connectionRetryCount: number;
    /**
     * Enable Keep Alive for unstable networks
     * @defaultValue undefined
     */
    enableKeepAliveUsingOptionsForUnstableNetworks: boolean;
}
export interface IMediaStreamRenderer {
    localMediaElement?: HTMLMediaElement;
    remoteMediaElement: HTMLMediaElement;
}
