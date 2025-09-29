import NotFound from '@/components/auth/shared-components/NotFound';
import { ResponsiveContainer } from '@/components/ContainerElements';
import { isRouteErrorResponse, useRouteError } from 'react-router';

const ErrorPage = () => {
    const error = useRouteError();
    const isProduction = import.meta.env.PROD;

    const renderErrorMessage = () => {
        // This guards against error being falsy.
        if (!error) {
            return <NotFound errorMessage="Unknown error occurred." />;
        }
        // router error
        if (isRouteErrorResponse(error)) {
            if (isProduction) {
                return <NotFound />;
            }
            return (
                <NotFound
                    errorMessage={`Router Status: ${error.status} - ${error.statusText || 'Unknown Error'}`}
                />
            );
        }
        // generic JavaScript error
        else {
            if (isProduction) {
                return <NotFound />;
            }
            return (
                <NotFound
                    errorMessage={`JS Error: ${(error as Error).message ?? 'An unexpected error occurred.'}`}
                />
            );
        }
    };

    return <ResponsiveContainer>{renderErrorMessage()}</ResponsiveContainer>;
};

export default ErrorPage;
