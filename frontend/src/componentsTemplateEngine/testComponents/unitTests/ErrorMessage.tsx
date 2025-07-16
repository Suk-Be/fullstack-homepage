const ErrorMessage = ({ message = 'Something went wrong' }: { message?: string }) => {
    return <div data-testid="message-container">{message}</div>;
};

export default ErrorMessage;
