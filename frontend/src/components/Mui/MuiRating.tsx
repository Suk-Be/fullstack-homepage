import { useNumber } from '@/hooks/useNumber';
import { Favorite, FavoriteOutlined } from '@mui/icons-material';
import { Rating, Stack } from '@mui/material';

export const MuiRating = () => {
    const rating = {
        integer: useNumber(null),
        halfNumbers: useNumber(null),
        halfHearts: useNumber(null),
        readOnly: useNumber(3),
        highlightSelectedOnly: useNumber(3),
    };

    return (
        <Stack
            spacing={4}
            sx={{
                mb: 8,
            }}
        >
            <Stack spacing={1}>
                <Rating value={rating.integer.value} onChange={rating.integer.onChange} />
                {rating.integer.value !== null && (
                    <span>You rated {rating.integer.value} stars</span>
                )}
            </Stack>

            <Stack spacing={1} direction="row" alignItems="center">
                <Rating
                    value={rating.halfNumbers.value}
                    onChange={rating.halfNumbers.onChange}
                    precision={0.5}
                    size="large"
                />
                {rating.halfNumbers.value !== null && (
                    <span>You rated {rating.halfNumbers.value} stars</span>
                )}
            </Stack>

            <Stack spacing={1} direction="row" alignItems="center">
                <Rating
                    value={rating.halfHearts.value}
                    onChange={rating.halfHearts.onChange}
                    precision={0.5}
                    size="large"
                    icon={<Favorite fontSize="inherit" color="error" />}
                    emptyIcon={<FavoriteOutlined fontSize="inherit" />}
                />
                {rating.halfHearts.value !== null && (
                    <span>You rated {rating.halfHearts.value} hearts</span>
                )}
            </Stack>

            <Stack spacing={1} direction="row" alignItems="center">
                <Rating
                    value={rating.readOnly.value}
                    size="large"
                    icon={<Favorite fontSize="inherit" color="error" />}
                    emptyIcon={<FavoriteOutlined fontSize="inherit" />}
                    readOnly
                />
                {rating.readOnly.value !== null && (
                    <span>You rated {rating.readOnly.value} hearts</span>
                )}
            </Stack>

            <Stack spacing={1} direction="row" alignItems="center">
                <Rating
                    value={rating.highlightSelectedOnly.value}
                    onChange={rating.highlightSelectedOnly.onChange}
                    size="large"
                    icon={<Favorite fontSize="inherit" color="error" />}
                    emptyIcon={<FavoriteOutlined fontSize="inherit" />}
                    highlightSelectedOnly
                />
                {rating.highlightSelectedOnly.value !== null && (
                    <span>You rated {rating.highlightSelectedOnly.value} hearts</span>
                )}
            </Stack>
        </Stack>
    );
};
