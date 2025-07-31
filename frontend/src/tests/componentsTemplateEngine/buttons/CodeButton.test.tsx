import CodeButton from '@/componentsTemplateEngine/buttons/CodeButton';
import { buttonText } from '@/utils/templateEngine/buttonText';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('CodeButton', () => {
    const renderComponent = (text = buttonText.showMarkup[0]) => {
        const onClick = vi.fn();

        render(<CodeButton onClick={onClick}>{text}</CodeButton>);

        return {
            text,
            onClick,
        };
    };

    it('should render with a default text and Icon', () => {
        const { text } = renderComponent(buttonText.showMarkup[0]);

        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByLabelText('icon with open eye')).toBeInTheDocument();
    });

    it('should render with "Show Markup" icon and text', () => {
        const { text } = renderComponent(buttonText.showMarkup[1]);

        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByLabelText('icon with closed eye')).toBeInTheDocument();
    });

    it('should call a function when clicked', async () => {
        const { onClick } = renderComponent();

        const button = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(button);

        expect(onClick).toHaveBeenCalled();
    });
});
