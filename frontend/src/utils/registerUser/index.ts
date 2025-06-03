// import LaravelApiClient from '../plugins/axios';

// // const isTestEnv = import.meta.env.MODE === 'test';

// const registerUser = async ({
//     logState,
//     name,
//     email,
//     password,
//     password_confirmation,
// }: {
//     logState: boolean;
//     name: string;
//     email: string;
//     password: string;
//     password_confirmation: string;
// }) => {
//     try {
//         await LaravelApiClient.post('/auth/spa/register', {
//             name,
//             email,
//             password,
//             password_confirmation,
//         }).then((res) => {
//             console.log('registered User hook, todo make user global available', res.data);
//         });

//         if (logState) {
//             // after await post, now get user data
//             const { data } = await LaravelApiClient.get('/user');
//             console.log('get User data, successful login', data);
//         }
//         return { success: true };
//     } catch (error: any) {
//         if (error.response && error.response.data && error.response.data.errors) {
//             return {
//                 success: false,
//                 errors: error.response.data.errors, // Laravel style
//             };
//         }

//         console.error('Status:', error.response?.status);
//         console.error('Data:', error.response?.data);

//         return { success: false, message: error };
//     }
// };

// export default registerUser;
import Cookies from 'js-cookie';
import logUserAfterRegistration from './logUserAfterRegistration';
import headers, { registerHeaders } from './requestHeaders';
const registerUser = async ({
    islogRegisteredUser,
    name,
    email,
    password,
    password_confirmation,
}: {
    islogRegisteredUser: boolean;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}) => {
    let csrfToken: string | undefined;

    try {
        // Step 1: Get CSRF cookie
        console.log('Fetching CSRF cookie...');
        await fetch('http://localhost:8000/api/csrf-cookie', {
            headers: headers,
            credentials: 'include',
        }).then(() => {
            csrfToken = Cookies.get('XSRF-TOKEN');
            console.log('CSRF token fetched:', csrfToken);
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }
        });

        // Step 2: Send register request
        if (csrfToken) {
            const response = await fetch('http://localhost:8000/api/auth/spa/register', {
                method: 'POST',
                credentials: 'include',
                headers: registerHeaders(csrfToken),
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    password_confirmation: password_confirmation,
                }),
            });

            // Step 3: Return response status errors for form validation of existing emails in db
            if (response.status === 422) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'User already exists' };
            }
            if (response.status === 401) {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.message || 'Nicht autorisiert – ggf. ausgeloggt',
                };
            }
            if (response.status === 419) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'CSRF-Token abgelaufen' };
            }

            // Step 4: Optionally get user data if logState is true
            await logUserAfterRegistration(islogRegisteredUser, csrfToken);
        }
        // If everything is successful, return success
        return { success: true };
    } catch (error: any) {
        console.log('Status:', error);

        console.log('Status:', error);

        return { success: false, message: error };
    }
};

export default registerUser;
