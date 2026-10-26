import { useMultiSelect } from '@/hooks/useMultiSelect';
import { Autocomplete, Stack, TextField } from '@mui/material';

const MuiAutocomplete = () => {
    const Skills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'react'];

    const skills = useMultiSelect<string>();
    console.log('skills picked', skills.values);

    return (
        <Stack
            spacing={4}
            width="250px"
            sx={{
                mb: 8,
            }}
        >
            <Autocomplete
                options={Skills}
                renderInput={(params) => <TextField {...params} label="skills" />}
            />
        </Stack>
    );
};

export { MuiAutocomplete };
