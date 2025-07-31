import Button from '@/componentsTemplateEngine/buttons/Button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('Button', () => {
    const buttonText = 'test';
    const onClick = vi.fn();
    const renderComponent = () => {
        render(
            <Button className={buttonText} onClick={onClick}>
                {buttonText}
            </Button>,
        );
    };

    it('should render a button with a given text', () => {
        renderComponent();
        expect(screen.getByText(buttonText)).toBeInTheDocument();
    });

    it('should render a button with an additional styling class', async () => {
        const { container } = render(
            <Button className={buttonText} onClick={onClick}>
                {buttonText}
            </Button>,
        );

        expect(
            container.firstChild instanceof HTMLElement &&
                container.firstChild.classList.contains(buttonText),
        ).toBe(true);
    });

    it('should call a function when clicked', async () => {
        renderComponent();

        const button = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(button);

        expect(onClick).toHaveBeenCalled();
    });
});
