import { useBoolean } from '@/hooks/useBoolean';
import { useMultiSelect } from '@/hooks/useMultiSelect';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Stack,
    Typography,
} from '@mui/material';
import { useState } from 'react';

const MuiCheckbox = () => {
    const Skills = ['HTML', 'CSS', 'JavaScript'];

    const skills = useMultiSelect<string>();
    console.log('skills picked', skills.values);

    const CSS = ['Color', 'Spacing', 'Typography'];
    const css = useMultiSelect<string>();

    const [error, setError] = useState(false);

    const acceptTnC = useBoolean();
    console.log('accept terms and conditions', acceptTnC.value);

    const bookmarked = useBoolean(true);
    console.log('bookmarked', bookmarked.value);

    return (
        <Stack
            spacing={4}
            sx={{
                mb: 8,
            }}
        >
            <Box>
                <FormControlLabel
                    control={<Checkbox checked={acceptTnC.value} onChange={acceptTnC.onChange} />}
                    label="I accept terms and conditions"
                />
                {/** size, color prop on Checkbox */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={acceptTnC.value}
                            onChange={acceptTnC.onChange}
                            size="small"
                            color="secondary"
                        />
                    }
                    label="I accept terms and conditions"
                />
            </Box>

            <Box>
                <Checkbox
                    icon={<BookmarkAddIcon />}
                    checkedIcon={<BookmarkAddedIcon />}
                    checked={bookmarked.value}
                    onChange={bookmarked.onChange}
                />
            </Box>

            <Stack spacing={2} direction="row">
                  <FormControl>
                      <FormLabel>Skills</FormLabel>
                      <FormGroup>
                          {Skills.map((skill) => (
                              <FormControlLabel
                                  control={
                                      <Checkbox
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

                {/** FormControl prop error (boolean) */}
                {/** FormGroup prop row*/}
                <FormControl error={error}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            mb: 1,
                            color: 'var(--template-palette-text-secondary)',
                            fontWeight: 300,
                        }}
                        color="secondary"
                    >
                        Skills
                    </Typography>
                    <FormGroup row>
                        {Skills.map((skill) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
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
                    <Button onClick={() => setError((prev) => !prev)} variant="contained">
                        toggle error
                    </Button>
                    {error && <FormHelperText>Invalid Section</FormHelperText>}
                </FormControl>

                <FormControl>
                    <FormLabel>CSS</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            label="Alle auswählen"
                            control={
                                <Checkbox
                                    checked={css.isAllSelected(CSS)}
                                    indeterminate={css.isSomeSelected(CSS)}
                                    onChange={(_e, checked) =>
                                        checked ? css.selectAll(CSS) : css.clear()
                                    }
                                />
                            }
                        />
                        {CSS.map((design) => (
                            <FormControlLabel
                                key={design}
                                label={design}
                                control={
                                    <Checkbox
                                        value={design}
                                        checked={css.has(design)}
                                        onChange={(e, checked) =>
                                            css.toggle(e.target.value, checked)
                                        }
                                    />
                                }
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </Stack>

            <Stack spacing={2} direction="row">
                <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                    <FormControlLabel required control={<Checkbox />} label="Required" />
                    <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                </FormGroup>
            </Stack>
        </Stack>
    );
};

export { MuiCheckbox };
