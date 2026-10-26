import {
    Box,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
} from '@mui/material';
import { useState } from 'react';

const MuiRadioButtons = () => {
    const [experience, setExperience] = useState<string[]>([]);
    const jobExperienceRange = ['0-2', '3-5', '6-10'];
    const handleSetExperience = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const next = typeof value === 'string' ? value.split(',') : value;
        setExperience(next);
        console.log('next job experience:', next);
    };
    return (
        <Stack
            spacing={4}
            sx={{
                mb: 8,
            }}
        >
            <Stack spacing={2} direction="row">
                <Box width="250px">
                    <FormControl>
                        <FormLabel id="job-experience-group">Years of Experience</FormLabel>
                        <RadioGroup
                            name="job-experience-group"
                            aria-labelledby="job-experience-group"
                            value={experience}
                            onChange={handleSetExperience}
                        >
                            {jobExperienceRange.map((range) => (
                                <FormControlLabel
                                    control={<Radio />}
                                    key={range}
                                    label={range}
                                    value={range}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>

                {/** property row, Radio Component size, color property **/}
                <Box width="250px">
                    <FormControl>
                        <FormLabel id="job-experience-group">Years of Experience</FormLabel>
                        <RadioGroup
                            name="job-experience-group"
                            aria-labelledby="job-experience-group"
                            value={experience}
                            onChange={handleSetExperience}
                            row
                        >
                            {jobExperienceRange.map((range) => (
                                <FormControlLabel
                                    control={<Radio size="small" color="secondary" />}
                                    key={range}
                                    label={range}
                                    value={range}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Stack>

            {/** property error on FormControl, FormHelperText Component to display error messages **/}
            <Box width="250px">
                <FormControl error>
                    <FormLabel id="job-experience-group">Years of Experience</FormLabel>
                    <RadioGroup
                        name="job-experience-group"
                        aria-labelledby="job-experience-group"
                        value={experience}
                        onChange={handleSetExperience}
                    >
                        {jobExperienceRange.map((range) => (
                            <FormControlLabel
                                control={<Radio />}
                                key={range}
                                label={range}
                                value={range}
                            />
                        ))}
                    </RadioGroup>
                    <FormHelperText>Invaild Selection</FormHelperText>
                </FormControl>
            </Box>

            <Stack></Stack>
        </Stack>
    );
};

export { MuiRadioButtons };
