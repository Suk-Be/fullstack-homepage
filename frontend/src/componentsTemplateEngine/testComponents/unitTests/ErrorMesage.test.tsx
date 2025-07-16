import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../../../componentsTemplateEngine/testComponents/unitTests/ErrorMessage';

/**
 * render(Component);
 *
 * renders the Component to jsdom
 * calling
 * render(<ErrorMessage />)
 */

/**
 * screen.debug();
 *
 * outputs the html to the console
 * calling
 * render(<ErrorMessage />)
 * screen.debug();
 */

/**
 * data-testid
 *
 * is used to identify the component for testing
 *
 * the attribute will be used in the compoent
 * e.g. return <div data-testid="message-container">{message}</div>;
 *
 * it can be tested in expect statement
 * expect(screen.getByTestId('message-container')).toHaveTextContent('foo');
 */

describe('ErrorMessage', () => {
    it('renders default error state', () => {
        render(<ErrorMessage />);
        // screen.debug();
        expect(screen.getByTestId('message-container')).toHaveTextContent('Something went wrong');
    });
    it('renders custom error state', () => {
        const customErrorMessage = 'E-Mail has already been taken';
        render(<ErrorMessage message={customErrorMessage} />);
        expect(screen.getByTestId('message-container')).toHaveTextContent(customErrorMessage);
    });
});
