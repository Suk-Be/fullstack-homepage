import { FC } from 'react';

type ChlidrenTagsProps = {
    arr: string[];
};

const ChildrenTags: FC<ChlidrenTagsProps> = ({ arr }: ChlidrenTagsProps) => {
    return (
        <code className="block pl-4">
            {arr.map((elem: string, index: number) => (
                <div key={index}>{elem}</div>
            ))}
        </code>
    );
};

export default ChildrenTags;
