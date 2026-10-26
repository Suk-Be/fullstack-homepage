import { useInput } from '@/hooks/useInput';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

function TestHarness(props: { initial?: string; onSideEffect?: (v: string) => void }) {
    const input = useInput(props.initial ?? '', { onChange: props.onSideEffect });

    return (
        <div>
            <div data-testid="value">{input.value}</div>

            <label htmlFor="test-input">Test</label>
            <input id="test-input" value={input.value} onChange={input.onChange} />

            <button type="button" onClick={() => input.setValue('manual')}>
                Set manual
            </button>
        </div>
    );
}

describe('useInput', () => {
    it('uses empty string as default initial value', () => {
        render(<TestHarness />);
        expect(screen.getByTestId('value')).toHaveTextContent('');
        expect(screen.getByLabelText('Test')).toHaveValue('');
    });

    it('accepts a custom initial value', () => {
        render(<TestHarness initial="hello" />);
        expect(screen.getByTestId('value')).toHaveTextContent('hello');
        expect(screen.getByLabelText('Test')).toHaveValue('hello');
    });

    it('updates value via onChange when typing', async () => {
        const user = userEvent.setup();
        render(<TestHarness />);

        const input = screen.getByLabelText('Test');
        await user.type(input, 'abc');

        expect(screen.getByTestId('value')).toHaveTextContent('abc');
        expect(input).toHaveValue('abc');
    });

    it('calls opts.onChange with the latest value after internal update', async () => {
        const user = userEvent.setup();
        const sideEffect = vi.fn();

        render(<TestHarness onSideEffect={sideEffect} />);

        const input = screen.getByLabelText('Test');
        await user.type(input, 'a');

        // called once for the single character typed
        expect(sideEffect).toHaveBeenCalledTimes(1);
        expect(sideEffect).toHaveBeenCalledWith('a');

        // state is updated too
        expect(screen.getByTestId('value')).toHaveTextContent('a');
    });

    it('allows manual updates via setValue', async () => {
        const user = userEvent.setup();
        render(<TestHarness />);

        await user.click(screen.getByRole('button', { name: /set manual/i }));

        expect(screen.getByTestId('value')).toHaveTextContent('manual');
        expect(screen.getByLabelText('Test')).toHaveValue('manual');
    });
});
