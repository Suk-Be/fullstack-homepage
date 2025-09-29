import SaveGridsTeaser from '@/componentsTemplateEngine/teaser/SaveGridsTeaser';
import * as reduxHooks from '@/store/hooks';
import * as loginSelectors from '@/store/selectors/loginSelectors';
import * as userGridSelectors from '@/store/selectors/userGridSelectors';
import { render, screen } from '@testing-library/react';
import { it, vi } from 'vitest';

describe('SaveGridsTeaser', () => {
    const mockDispatch = vi.fn();
    const mockGrids = [
        {
            layoutId: 'grid-1',
            timestamp: new Date().toISOString(),
            name: 'Test Grid',
            config: {
                items: '1',
                columns: '1',
                gap: '0',
                border: '0',
                paddingX: '0',
                paddingY: '0',
            },
        },
    ];

    beforeEach(() => {
        const currentGrids = [...mockGrids];

        vi.clearAllMocks();
        // access and return dispatches
        vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
        // access and return state
        vi.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) => {
            if (selector === loginSelectors.selectUserId) return 'user-123';
            if (selector === userGridSelectors.selectGridsFromThisUser) return currentGrids;
            if (selector === userGridSelectors.selectSortedGrids) return mockGrids;
            return null;
        });

        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        });
    });

    it('should render the headline and the button of the SaveGridsModal component', () => {
        render(<SaveGridsTeaser />);

        const containerElement = screen.getByTestId('teaser-save-this-grid');
        expect(containerElement).toBeInTheDocument();

        const headlineElement = screen.getByText('Save this Grid');
        expect(headlineElement).toBeInTheDocument();

        // button of the SaveGridsModal component
        const modalButton = screen.getByRole('button', { name: /meaningful name/i });
        expect(modalButton).toBeInTheDocument();
    });
});
