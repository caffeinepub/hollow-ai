import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type MessageId = string;
export interface Message {
    id: MessageId;
    content: string;
    timestamp: bigint;
}
export type SessionId = string;
export interface SessionView {
    id: SessionId;
    messages: Array<Message>;
    lastActive: bigint;
}
export interface backendInterface {
    addMessageToSession(sessionId: SessionId, message: Message): Promise<void>;
    getSession(sessionId: SessionId): Promise<SessionView>;
    getUserSessions(): Promise<Array<SessionView>>;
    registerUser(): Promise<void>;
    solveMathProblem(expression: string): Promise<string>;
}
