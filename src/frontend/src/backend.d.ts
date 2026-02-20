import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type ArtworkId = string;
export type MusicId = string;
export type MessageId = string;
export interface Message {
    id: MessageId;
    content: string;
    timestamp: bigint;
}
export interface GameMetadata {
    id: GameId;
    title: string;
    thumbnail: ExternalBlob;
    playable: boolean;
    description: string;
    category: string;
}
export type SessionId = string;
export type GameId = string;
export interface SessionView {
    id: SessionId;
    messages: Array<Message>;
    lastActive: bigint;
}
export interface GameCatalogueView {
    id: GameId;
    title: string;
    playable: boolean;
    description: string;
    hasThumbnail: boolean;
    category: string;
}
export interface backendInterface {
    addGameMetadata(gameMetadata: GameMetadata): Promise<void>;
    addMessageToSession(sessionId: SessionId, message: Message): Promise<void>;
    getAllArtworks(): Promise<Array<[ArtworkId, ExternalBlob]>>;
    getAllMusic(): Promise<Array<[MusicId, ExternalBlob]>>;
    getGameCatalogue(): Promise<Array<GameCatalogueView>>;
    getGameMetadata(gameId: GameId): Promise<GameMetadata>;
    getSession(sessionId: SessionId): Promise<SessionView>;
    getUserSessions(): Promise<Array<SessionView>>;
    registerUser(): Promise<void>;
    retrieveArtwork(artworkId: ArtworkId): Promise<ExternalBlob>;
    retrieveMusic(musicId: MusicId): Promise<ExternalBlob>;
    shareArtwork(artworkId: ArtworkId, imageBlob: ExternalBlob): Promise<void>;
    shareMusic(musicId: MusicId, audioBlob: ExternalBlob): Promise<void>;
}
