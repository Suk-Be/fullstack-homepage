import { useInput } from '@/hooks/useInput';
import { useSelectArray } from '@/hooks/useSelectArray';
import { Box, MenuItem, Stack, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useState } from 'react';

const MuiSelect = () => {
    const country = useInput();
    console.log(country.value);

    const countries = useSelectArray();
    const [countriesTouched, setCountriesTouched] = useState(false);
    const countriesHasError = countriesTouched && countries.value.length === 0;

    // Select Component Approach
    const ageList = ['10', '20', '30', '40', '50'];
    const age = useInput();
    console.log(age.value);

    const ages = useSelectArray();

    return (
        <Stack
            spacing={4}
            sx={{
                mb: 8,
            }}
        >
            {/** TextField Component Approach **/}
            <Stack>
                <Box width="250px">
                    <TextField
                        label="Select Country"
                        select
                        value={country.value}
                        onChange={country.onChange}
                        fullWidth // takes the fullWidth of the parent (250px)
                    >
                        <MenuItem value="IN">India</MenuItem>
                        <MenuItem value="US">United States</MenuItem>
                        <MenuItem value="DE">Germany</MenuItem>
                    </TextField>
                </Box>
            </Stack>

            <Stack>
                <Box width="250px">
                    <TextField
                        label="Select Countries"
                        select
                        value={countries.value}
                        onChange={countries.onChange}
                        onBlur={() => setCountriesTouched(true)}
                        fullWidth
                        slotProps={{
                            select: {
                                multiple: true,
                            },
                        }}
                        size="small"
                        color="info"
                        helperText={
                            countriesHasError
                                ? 'Please select at least one country.'
                                : 'You can pick multiple countries.'
                        }
                        error={countriesHasError}
                    >
                        <MenuItem value="IN">India</MenuItem>
                        <MenuItem value="US">United States</MenuItem>
                        <MenuItem value="DE">Germany</MenuItem>
                    </TextField>
                </Box>
            </Stack>

            {/** Select Component Approach **/}
            <Stack>
                <Box width="250px">
                    <InputLabel id="age-label">Age</InputLabel>
                    <Select
                        labelId="age-label"
                        id="age"
                        value={age.value}
                        label="Age"
                        onChange={(e) => age.setValue(e.target.value)}
                        fullWidth
                    >
                        {ageList.map((age) => (
                            <MenuItem key={age} value={age}>
                                {age}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Stack>

            <Stack>
                <Box width="250px">
                    <InputLabel id="ages-label">Ages</InputLabel>
                    <Select
                        labelId="ages-label"
                        id="ages"
                        multiple
                        value={ages.value}
                        label="Age"
                        onChange={ages.onChange}
                        fullWidth
                    >
                        {ageList.map((ageItem) => (
                            <MenuItem key={ageItem} value={ageItem}>
                                {ageItem}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Stack>
        </Stack>
    );
};

export { MuiSelect };
