import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import useLogin from '../hooks/useLogin';
// import useRegister from '../hooks/useRegister';

const globalStyle = {
    marginBottom: '0.5rem',
    containerFlexCenter: {
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
    },
};

const h1Style = {
    fontSize: '2rem',
    marginBottom: globalStyle.marginBottom,
};

const buttonStyle = {
    fontSize: '1rem',
    marginBottom: globalStyle.marginBottom,
};

const ratingStyle = h1Style;

const RatingAndLoginTest = () => {
    const [ratingValue, setRatingValue] = useState<number | null>(null);
    const [comment, setCommentValue] = useState('');

    const isDisabled = ratingValue === null || comment === '';

    useLogin();
    // useRegister();

    return (
        <>
            <Box sx={globalStyle.containerFlexCenter}>
                <Box
                    sx={{
                        width: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h1" sx={h1Style}>
                        How would you rate this experience?
                    </Typography>
                    <Rating
                        value={ratingValue}
                        onChange={(_, value) => setRatingValue(value)}
                        sx={ratingStyle}
                    />
                    <TextField
                        multiline
                        maxRows={4}
                        sx={{ marginBottom: '1rem' }}
                        value={comment}
                        onChange={(e) => setCommentValue(e.target.value)}
                    />
                    <Button variant="contained" sx={buttonStyle} disabled={isDisabled}>
                        Hello World
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default RatingAndLoginTest;
