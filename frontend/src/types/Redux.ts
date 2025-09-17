export type PreloadedState<T> = Partial<T> | {};

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';  // nur vom Backend
}

export interface UserSaveGridsState {
    userId: User['id'] | null;
    name?: string;
    savedGrids: {
        [layoutId: string]: GridConfig; // Normalisiertes Objekt
    };
}
export interface GridConfig {
    layoutId: string;
    timestamp: string;
    name: string;
    config: {
        items: string;
        columns: string;
        gap: string;
        border: string;
        paddingX: string;
        paddingY: string;
    };
}

export type GridConfigKey = keyof GridConfig['config'];

// loginSlice

export interface LoginArgs {
    email: string;
    password: string;
}

export interface UserResponseSuccess {
    userId: number | undefined;
    role: 'user' | 'admin';
}
