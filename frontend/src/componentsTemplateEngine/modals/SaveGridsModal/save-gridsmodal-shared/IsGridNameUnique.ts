import { GridConfig } from '@/types/Redux';

export function isGridNameUnique(
    name: string,
    savedGrids: Record<string, GridConfig>,
    setErrorMessage?: (msg: string) => void,
): boolean {
    if (!name.trim()) {
        setErrorMessage?.('Please input a recognizable name.');
        return false;
    }

    const alreadyExists = Object.values(savedGrids).some((g) => {
        if (!g || !g.name) return false;
        return g.name.toLowerCase() === name.trim().toLowerCase();
    });

    if (alreadyExists) {
        setErrorMessage?.(
            `A grid with the name "${name}" already exists. Please choose a different name.`,
        );
        return false;
    }

    return true;
}
