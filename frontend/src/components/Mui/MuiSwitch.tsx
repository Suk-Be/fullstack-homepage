import { useBoolean } from '@/hooks/useBoolean';
import { useMultiSelect } from '@/hooks/useMultiSelect';
import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Stack,
    Switch,
} from '@mui/material';

const MuiSwitch = () => {
    const darkMode = useBoolean();
    console.log('darkmode value', { dark: darkMode.value });

    const Skills = ['HTML', 'CSS', 'JavaScript'];
    const skills = useMultiSelect<string>();

    return (
        <>
            <Stack
                spacing={4}
                sx={{
                    mb: 8,
                }}
            >
                <Box>
                    <FormControlLabel
                        label="dark mode"
                        control={
                            <Switch
                                checked={darkMode.value}
                                onChange={darkMode.onChange}
                                aria-label="Switch demo"
                            />
                        }
                    />
                </Box>
                <Box>
                    <FormControlLabel
                        label="dark mode"
                        control={
                            <Switch
                                checked={darkMode.value}
                                onChange={darkMode.onChange}
                                aria-label="Switch demo"
                                size="small"
                                color="error"
                            />
                        }
                    />
                </Box>
            </Stack>
            <Stack
                spacing={2}
                direction="row"
                sx={{
                    mb: 8,
                }}
            >
                <FormControl>
                    <FormLabel>Skills</FormLabel>
                    <FormGroup>
                        {Skills.map((skill) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        value={skill}
                                        checked={skills.has(skill)}
                                        onChange={(_e, checked) => skills.toggle(skill, checked)}
                                    />
                                }
                                key={skill}
                                label={skill}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </Stack>
        </>
    );
};

export { MuiSwitch };
