// src/theme.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        background: {
            default: '#f4f6f8',  // tło strony — delikatnie szare zamiast białego
            paper: '#ffffff',    // tło kart, tabel, modali
        },
    },

    shape: {
        borderRadius: 8,  // domyślne zaokrąglenie dla Button, TextField, Paper, itp.
    },

    components: {
        // ─── AppBar ───────────────────────────────────────────────
        MuiAppBar: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: ({ theme }) => ({
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }),
            },
        },

        // ─── Paper / karty ────────────────────────────────────────
        // Usuwa domyślny box-shadow, zastępuje go cienką ramką.
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: ({ theme }) => ({
                    border: `1px solid ${theme.palette.divider}`,
                }),
            },
        },

        // ─── Button ───────────────────────────────────────────────
        MuiButton: {
            defaultProps: {
                disableElevation: true,  // płaskie przyciski bez cienia
            },
        },

        // ─── TableHead ────────────────────────────────────────────
        // Eliminuje hardkodowany background: "#fff" w sticky nagłówkach
        MuiTableHead: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.background.default,
                }),
            },
        },

        // ─── TableCell ────────────────────────────────────────────
        // Nagłówki tabeli — pogrubiony tekst, mniejszy rozmiar
        MuiTableCell: {
            styleOverrides: {
                head: ({ theme }) => ({
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    color: theme.palette.text.secondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: theme.palette.background.default,
                }),
            },
        },

        // ─── Drawer / Sidebar ─────────────────────────────────────
        // MuiPaper globalnie dodaje border ze wszystkich stron.
        // Drawer potrzebuje tylko prawej krawędzi — resetujemy border
        // i ustawiamy tylko borderRight.
        MuiDrawer: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    border: 'none',
                    borderRight: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                }),
            },
        },

        // ─── ListItemButton (Sidebar — aktywna pozycja) ───────────
        MuiListItemButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.shape.borderRadius,
                    margin: '2px 8px',
                    width: 'calc(100% - 16px)',
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main + '14', // 8% opacity
                        color: theme.palette.primary.main,
                        '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                        },
                        '&:hover': {
                            backgroundColor: theme.palette.primary.main + '1F', // 12% opacity
                        },
                    },
                }),
            },
        },

        // ─── TextField ────────────────────────────────────────────
        MuiTextField: {
            defaultProps: {
                size: 'small',  // domyślnie mały — pasuje do filtrów i formularzy ERP
            },
        },
    },
})

export default theme