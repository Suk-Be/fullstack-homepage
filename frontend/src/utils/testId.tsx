export const testId = (id: string) =>
    process.env.NODE_ENV === 'test' ? { 'data-testid': id } : {};
