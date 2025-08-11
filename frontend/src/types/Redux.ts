export type PreloadedState<T> = Partial<T> | {};

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
}
export interface UserGridState {
    userId: User['id'] | null;
    savedGrids: {
        [layoutId: string]: GridConfig; // Normalisiertes Objekt
    };
}
export interface GridConfig {
    layoutId: string;
    timestamp: string;
    config: {
        items: string;
        columns: string;
        gap: string;
        border: string;
        paddingX: string;
        paddingY: string;
    };
}

// loginSlice

export interface LoginArgs {
    email: string;
    password: string;
}
