import CopyButton from '@/componentsTemplateEngine/buttons/CopyButton';
import { buttonText } from '@/utils/templateEngine/buttonText';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('CopyButton', () => {
    const renderComponent = (text = buttonText.copyToClipboard[0]) => {
        const onClick = vi.fn();

        render(<CopyButton onClick={onClick}>{text}</CopyButton>);

        return {
            text,
            onClick,
        };
    };

    it('should render with a default text and Icon', () => {
        const { text } = renderComponent(buttonText.copyToClipboard[0]);

        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByLabelText('icon copy board')).toBeInTheDocument();
    });

    it('should render with a copy-icon-check when the button text is "Is copied to Clipboard"', () => {
        const { text } = renderComponent(buttonText.copyToClipboard[1]);

        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByLabelText('icon copy board check')).toBeInTheDocument();
    });

    it('should call a function when clicked', async () => {
        const { onClick } = renderComponent();

        const button = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(button);

        expect(onClick).toHaveBeenCalled();
    });
});
