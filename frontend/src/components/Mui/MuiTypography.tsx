import { Stack, Typography } from '@mui/material';

const MuiTypography = () => {
    return (
        <Stack
            sx={{
                mb: 8,
            }}
        >
            <Typography variant="h1" gutterBottom>
                h1 heading
            </Typography>
            <Typography variant="h2">h2 heading</Typography>
            <Typography variant="h3">h3 heading</Typography>
            <Typography variant="h4">h4 heading</Typography>

            {/* https://v6.mui.com/material-ui/customization/default-theme/ hier kann man sehen dass typography object 
            auch andere objekte hat z.B. h1, body2 subtitle, button etc. */}

            <Typography variant="h4" component="h1">
                h1 heading, h4 style
            </Typography>

            <Typography variant="h5">h5 heading</Typography>

            {/* gutterBottom creates marginBottom values dependent on on the variants
            that have different sizes too */}

            <Typography variant="h6" gutterBottom>
                h6 heading
            </Typography>

            <Typography variant="subtitle1">sub title 1</Typography>

            <Typography variant="subtitle2" gutterBottom>
                sub title 2
            </Typography>

            <Typography variant="body1" gutterBottom>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic eos adipisci
                accusantium libero dolore, quod neque tempora sit molestiae nihil, ducimus tenetur
                atque, fugiat vero recusandae illo. Voluptate, consequatur ad?
            </Typography>

            {/* ohne variant wird default body 1 genommen, siehe css Klassen in html */}

            <Typography gutterBottom>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic eos adipisci
                accusantium libero dolore, quod neque tempora sit molestiae nihil, ducimus tenetur
                atque, fugiat vero recusandae illo. Voluptate, consequatur ad?
            </Typography>

            <Typography variant="body2" gutterBottom>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, repellat rerum
                quisquam rem provident nostrum. Possimus fuga perspiciatis quo, at tenetur et eius
                commodi mollitia voluptatum, suscipit deserunt eaque provident!
            </Typography>
        </Stack>
    );
};

export { MuiTypography };
