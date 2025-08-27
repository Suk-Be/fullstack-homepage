const headers: Record<string, string> = {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

const registerHeaders = (csrfToken: string) => ({
    ...headers,
    'X-XSRF-TOKEN': csrfToken || '',
});

export default headers;
export { registerHeaders };
