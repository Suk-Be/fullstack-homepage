import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Pagination from '../../../componentsTemplateEngine/testComponents/unitTests/Pagination';

/**
 * getByTestId(data-testid);
 * good for single elements
 * e.g. expect(screen.getTestId('main-container')).toHaveTextContent('Hello Main');
 *
 * getAllByTestId(data-testid)
 * good for dynamicly rendered elements, gets all the rendered elements in an array
 * e.g. expect(screen.getAllByTestId('page-container')).toHaveLength(5);
 * e.g. expect(screen.getAllByTestId('page-container')[0]).toHaveTextContent('1');
 */

/**
 * getByTestId(data-testid);
 * good for single elements
 * e.g. expect(screen.getTestId('main-container')).toHaveTextContent('Hello Main');
 *
 * getAllByTestId(data-testid)
 * good for dynamicly rendered elements, gets all the rendered elements in an array
 * e.g. expect(screen.getAllByTestId('page-container')).toHaveLength(5);
 * e.g. expect(screen.getAllByTestId('page-container')[0]).toHaveTextContent('1');
 */

describe('Pagination', () => {
    it('renders correct pagination', () => {
        render(<Pagination total={50} limit={10} currentPage={1} selectPage={() => {}} />);
        //screen.debug();
        const pageContainer = screen.getAllByTestId('page-container');
        expect(pageContainer).toHaveLength(5);
        expect(pageContainer[0]).toHaveTextContent('1');
    });

    it('should emit clicked page', async () => {
        // setup
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(<Pagination total={50} limit={10} currentPage={1} selectPage={handleClick} />);

        // action
        const pageContainers = screen.getAllByTestId('page-container');
        await user.click(pageContainers[0]);

        // assert
        //expect(handleClick).toHaveBeenCalledOnce();
        expect(handleClick).toHaveBeenCalledWith(1);
    });
});
