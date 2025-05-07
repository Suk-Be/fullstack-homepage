import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ListEntry from './ListEntry';
import ListNumber from './ListNumber';

const Item = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(56,255,148, 1)',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    fontFamily: 'Fira Sans',
    fontWeight: 400,
    fontSize: '1rem',
    color: 'rgba(33,29,29, 1)',
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(33,29,29, 0.1)',
    }),
}));

const NumberedList = () => {
    return (
        <Stack spacing={2} justifyContent="center" sx={{ marginBottom: '3rem' }}>
            <Item>
                <ListNumber>1</ListNumber>
                <ListEntry>Über 10 Jahre Frontend</ListEntry>
            </Item>
            <Item>
                <ListNumber>2</ListNumber>
                <ListEntry>Über 10 Jahre Design</ListEntry>
            </Item>
            <Item>
                <ListNumber>3</ListNumber>
                <ListEntry>Mitarbeit in wachsenden Systemen</ListEntry>
            </Item>
            <Item>
                <ListNumber>4</ListNumber>
                <ListEntry>erfahren in Industrie und Agenturen</ListEntry>
            </Item>
        </Stack>
    );
};

export default NumberedList;
