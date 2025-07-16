import { ChangeEvent, Dispatch, SetStateAction } from 'react';

export type Teaser = {
    type: string;
    id: number;
    attributes: {
        title: string;
        description: string;
        image?: string;
        isBigCard: boolean;
    };
    link?: string;
};

export type Welcome = {
    data: Teaser[];
};

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
};

export type GridProps = {
    items: string;
    columns: string;
    gap: string;
    border: string;
    paddingX: string;
    paddingY: string;
};

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user?: User;
        data?: Welcome;
    };
};

export type DynamicGridProps = {
    inlineStyles: {
        display: string;
        gridTemplateColumns: string;
        gap: string;
        borderWidth: string;
        padding: string;
    };
    gridItemsArray: number[];
};

export interface ModalProps extends DynamicGridProps {
    setIsOpen: Dispatch<
        SetStateAction<{
            open: boolean;
            text: string;
            isCopied: boolean;
        }>
    >;
    isOpen: {
        open: boolean;
        text: string;
        isCopied: boolean;
    };
    handleOpen: () => void;
    handleClose: () => void;
}

export type HandleChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => void;
export type HandleToggle = (value: SetStateAction<boolean>) => void;
