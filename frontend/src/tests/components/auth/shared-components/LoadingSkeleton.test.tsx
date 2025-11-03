import { LoadingSkeleton } from '@/components/auth/shared-components/LoadingSkeleton'; // passe den Pfad an
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('LoadingSkeleton Component', () => {
    it('renders a single skeleton by default', () => {
        render(<LoadingSkeleton />);
        const skeletons = screen.getAllByTestId('loading-skeleton');
        expect(skeletons).toHaveLength(1);
    });

    it('renders multiple skeletons when count is provided', () => {
        render(<LoadingSkeleton count={3} />);
        const skeletons = screen.getAllByTestId('loading-skeleton');
        expect(skeletons).toHaveLength(3);
    });

    it('applies custom height and width', () => {
        render(<LoadingSkeleton height={50} width={200} />);
        const skeleton = screen.getByTestId('loading-skeleton');
        expect(skeleton).toHaveStyle({ height: '50px', width: '200px' });
    });

    it('applies custom variant and animation', () => {
        render(<LoadingSkeleton variant="rectangular" animation="pulse" />);
        const skeleton = screen.getByTestId('loading-skeleton');
        expect(skeleton).toHaveClass('MuiSkeleton-rectangular');
        expect(skeleton).toHaveClass('MuiSkeleton-pulse');
    });
});
