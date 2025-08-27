type Props = {
    data: {
        id: number;
        type: 'profile' | 'offer' | 'teaser';
        attributes: {
            title: string;
            subtitle?: string;
            description?: string;
            image?: string;
            list?: [
                {
                    number: number;
                    text: string;
                },
            ];
        };
    };
};

type HP = {
    data: [Props];
};

export type { HP, Props };
