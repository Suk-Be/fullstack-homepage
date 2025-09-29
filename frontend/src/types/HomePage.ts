export interface Props {
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

export interface HP {
    data: [Props];
};
