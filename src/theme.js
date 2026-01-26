import { createTheme } from '@mui/material/styles'


const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
    },
    components: {
        MuiAppBar: {
            defaultProps: {
                elevation: 2,
            },
        },
    },
})


export default theme