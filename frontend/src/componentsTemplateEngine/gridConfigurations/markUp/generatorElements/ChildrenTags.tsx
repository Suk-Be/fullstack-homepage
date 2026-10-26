import { testId } from '@/utils/testId';
import { FC } from 'react';

interface ChlidrenTagsProps {
    arr: string[];
}

const ChildrenTags: FC<ChlidrenTagsProps> = ({ arr }: ChlidrenTagsProps) => {
    return (
        <code className="block pl-4" {...testId('children-tags-container')}>
            {arr.map((elem: string, index: number) => (
                <div key={index}>{elem}</div>
            ))}
        </code>
    );
};

export default ChildrenTags;
