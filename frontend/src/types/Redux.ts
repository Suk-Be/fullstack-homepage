export type PreloadedState<T> = Partial<T> | {};

export interface LayoutState {
    hasBorders: boolean;
}

export interface CounterState {
    value: number;
}
