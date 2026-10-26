import { ResponsiveContainer } from '@/components/ContainerElements';
import { MuiAutocomplete } from '@/components/Mui/MuiAutoComplete';
import { MuiButton } from '@/components/Mui/MuiButton';
import { MuiButtonGroup } from '@/components/Mui/MuiButtonGroup';
import { MuiCheckbox } from '@/components/Mui/MuiCheckbox';
import { MuiRadioButtons } from '@/components/Mui/MuiRadioButtons';
import { MuiRating } from '@/components/Mui/MuiRating';
import { MuiSelect } from '@/components/Mui/MuiSelect';
import { MuiSwitch } from '@/components/Mui/MuiSwitch';
import { MuiTextField } from '@/components/Mui/MuiTextfield';
import { MuiTypography } from '@/components/Mui/MuiTypography';
import { MuiToggleButton } from '@/components/Mui/ToggleButton';
import { CssBaseline } from '@mui/material';

const MuiPage = () => {
    return (
        <>
            <CssBaseline />
            <ResponsiveContainer>
                <div style={{ marginTop: '100px', marginBottom: '100px', padding: '4rem' }}>
                    <MuiTypography />
                    <MuiButton />
                    <MuiButtonGroup />
                    <MuiToggleButton />
                    <MuiTextField />
                    <MuiSelect />
                    <MuiRadioButtons />
                    <MuiCheckbox />
                    <MuiSwitch />
                    <MuiRating />
                    <MuiAutocomplete />
                </div>
            </ResponsiveContainer>
        </>
    );
};

export default MuiPage;
