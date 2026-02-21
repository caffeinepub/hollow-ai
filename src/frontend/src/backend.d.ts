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
export interface GameMetadata {
    title: string;
    description: string;
    author: Principal;
    creationTime: bigint;
    highScore: bigint;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createGame(title: string, category: string, description: string): Promise<string>;
    deleteGame(id: string): Promise<void>;
    getAllGames(): Promise<Array<GameMetadata>>;
    getAuthors(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<string>>;
    getGame(id: string): Promise<GameMetadata | null>;
    getHighScore(id: string): Promise<bigint>;
    getTemplate(name: string): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listTemplateNames(): Promise<Array<string>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchGamesByAuthor(author: Principal): Promise<Array<GameMetadata>>;
    searchGamesByCategory(category: string): Promise<Array<GameMetadata>>;
    updateHighScore(id: string, score: bigint): Promise<void>;
}
