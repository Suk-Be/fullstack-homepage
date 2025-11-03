import { testId } from '@/utils/testId';
import { Skeleton, SkeletonProps } from '@mui/material';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface LoadingSkeletonProps extends SkeletonProps {
    count?: number;
    className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    count = 1,
    variant = 'text',
    animation = 'wave',
    height,
    width,
    className,
    sx,
    ...props
}) => {
    return (
        <div className={twMerge('flex flex-col gap-2', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton
                    key={i}
                    {...testId('loading-skeleton')}
                    variant={variant}
                    animation={animation}
                    height={height}
                    width={width}
                    sx={{
                        borderRadius: variant === 'rectangular' ? 8 : undefined,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        ...sx,
                    }}
                    {...props}
                />
            ))}
        </div>
    );
};
