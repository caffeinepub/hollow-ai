import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    gamesPlayed: bigint;
    name: string;
    totalScore: bigint;
}
export interface Game {
    id: string;
    title: string;
    creator: Principal;
    description: string;
    lastModified: bigint;
    creationTime: bigint;
    gameCode: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createGame(title: string, description: string, gameCode: string): Promise<string>;
    deleteGame(id: string): Promise<void>;
    getAllGames(): Promise<Array<Game>>;
    getCallerGameCount(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCreatorGameCount(creator: Principal): Promise<bigint>;
    getCreators(): Promise<Array<Principal>>;
    getGame(id: string): Promise<Game | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateGame(id: string, title: string | null, description: string | null, gameCode: string | null): Promise<void>;
}
