import { brand } from '@/themes/themePrimitives';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ListEntry from './ListEntry';
import ListNumber from './ListNumber';

const Item = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: brand.logo,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    fontFamily: 'Fira Sans',
    fontWeight: 400,
    fontSize: '1rem',
    color: 'rgba(33,29,29, 1)',
    ...theme.applyStyles('dark', {
        color: 'rgba(0,0,0, 1)',
    }),
}));

interface Props {
    list: [
        {
            number: number;
            text: string;
        },
    ];
}

const NumberedList = ({ list }: Props) => {
    const List = list.map((item) => (
        <Item key={item.number}>
            <ListNumber>{item.number}</ListNumber>
            <ListEntry>{item.text}</ListEntry>
        </Item>
    ));

    return (
        <Stack spacing={2} justifyContent="center" sx={{ marginBottom: '3rem' }}>
            {List}
        </Stack>
    );
};

export default NumberedList;
