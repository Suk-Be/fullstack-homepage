import { FC, PropsWithChildren, ReactElement } from 'react';

type SpeakerListItemProps = {
    speaker: string | ReactElement;
    selected: boolean;
    onClick: (speaker: string | ReactElement) => void;
};

const SpeakerListItem: FC<PropsWithChildren<SpeakerListItemProps>> = ({
    speaker,
    selected,
    onClick,
}) => {
    const itemOnClick = () => onClick(speaker);

    let content = speaker;
    if (selected) {
        content = (
            <b>
                <i>{speaker}</i>
            </b>
        );
    }

    return <li onClick={itemOnClick}>{content}</li>;
};

export default SpeakerListItem;
