import { registerHeaders } from './requestHeaders';

const logUserAfterRegistration = async (islogRegisteredUser: boolean, csrfToken: string) => {
    if (islogRegisteredUser) {
        try {
            const response = await fetch('http://localhost:8000/api/user', {
                method: 'GET',
                credentials: 'include',
                headers: registerHeaders(csrfToken),
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log('get User data, successful login', json);
        } catch (error) {
            if (error instanceof Error) {
                console.error('error', error);
                console.error('errorMessage', error.message);
                console.error('Status:', error.stack);
            } else {
                console.error(error);
            }
        }
    }
};

export default logUserAfterRegistration;
