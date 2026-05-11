// src/theme.js
import { createTheme } from '@mui/material/styles'

const COLORS = {
    // ── Sidebar ───────────────────────────────────────
    sidebarBg:       '#1a1040',
    sidebarHover:    '#2a1f5a',
    sidebarActive:   '#7c3aed',
    sidebarText:     '#c4b5fd',

    // ── Akcent — fiolet ───────────────────────────────
    accent:          '#7c3aed',
    accentHover:     '#6d28d9',
    accentLight:     '#a78bfa',
    accentDim:       '#f5f3ff',
    accentText:      '#5b21b6',

    // ── Tła ───────────────────────────────────────────
    bgBase:          '#f8f7ff',
    bgSurface:       '#ffffff',
    bgMuted:         '#faf9ff',

    // ── Ramki ─────────────────────────────────────────
    border:          '#ede9fe',
    borderStrong:    '#c4b5fd',

    // ── Tekst ─────────────────────────────────────────
    textPrimary:     '#1e1035',
    textSecondary:   '#6b7280',
    textMuted:       '#9ca3af',
    textDisabled:    '#d1d5db',

    // ── Semantyczne ───────────────────────────────────
    success:         '#059669',
    successBg:       '#ecfdf5',
    successBorder:   '#6ee7b7',

    warning:         '#d97706',
    warningBg:       '#fffbeb',
    warningBorder:   '#fcd34d',

    danger:          '#dc2626',
    dangerBg:        '#fef2f2',
    dangerBorder:    '#fca5a5',
}

const theme = createTheme({

    // ── Paleta ───────────────────────────────────────────────────────────────
    palette: {
        mode: 'light',
        primary: {
            main:         COLORS.accent,
            light:        COLORS.accentLight,
            dark:         COLORS.accentHover,
            contrastText: '#ffffff',
        },
        background: {
            default: COLORS.bgBase,
            paper:   COLORS.bgSurface,
        },
        text: {
            primary:   COLORS.textPrimary,
            secondary: COLORS.textSecondary,
            disabled:  COLORS.textDisabled,
        },
        divider:  COLORS.border,
        success:  { main: COLORS.success },
        warning:  { main: COLORS.warning },
        error:    { main: COLORS.danger  },
    },

    // ── Typografia ───────────────────────────────────────────────────────────
    typography: {
        fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
        fontSize: 13,
        fontWeightRegular: 400,
        fontWeightMedium:  500,
        fontWeightBold:    600,
        h4: {
            fontSize:      '18px',
            fontWeight:    700,
            letterSpacing: '-0.4px',
            lineHeight:    1.2,
            color:         COLORS.textPrimary,
        },
        h5: {
            fontSize:      '16px',
            fontWeight:    700,
            letterSpacing: '-0.3px',
        },
        h6: {
            fontSize:      '14px',
            fontWeight:    600,
            letterSpacing: '-0.2px',
        },
        body1: {
            fontSize:   '13.5px',
            lineHeight: 1.5,
        },
        body2: {
            fontSize:   '13px',
            lineHeight: 1.5,
            color:      COLORS.textSecondary,
        },
        caption: {
            fontSize: '11px',
            color:    COLORS.textMuted,
        },
        button: {
            fontSize:      '13px',
            fontWeight:    600,
            textTransform: 'none',
            letterSpacing: 0,
        },
    },

    // ── Kształty ─────────────────────────────────────────────────────────────
    shape: {
        borderRadius: 8,
    },

    // ── Cienie ───────────────────────────────────────────────────────────────
    shadows: [
        'none',
        '0 1px 3px rgba(124,58,237,0.08), 0 1px 2px rgba(124,58,237,0.04)',
        '0 2px 6px rgba(124,58,237,0.08), 0 1px 3px rgba(124,58,237,0.04)',
        '0 4px 12px rgba(124,58,237,0.10)',
        '0 8px 20px rgba(124,58,237,0.12)',
        ...Array(20).fill('0 8px 24px rgba(124,58,237,0.12)'),
    ],

    // ── Komponenty ───────────────────────────────────────────────────────────
    components: {

        // ── CssBaseline ───────────────────────────────────────────────────
        MuiCssBaseline: {
            styleOverrides: `
                * { box-sizing: border-box; }

                body {
                    margin: 0;
                    background: ${COLORS.bgBase};
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                ::-webkit-scrollbar { width: 5px; height: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb {
                    background: ${COLORS.border};
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: ${COLORS.borderStrong};
                }
            `,
        },

        // ── AppBar / Topbar ────────────────────────────────────────────────
        MuiAppBar: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.bgSurface,
                    color:           COLORS.textPrimary,
                    borderBottom:    `1px solid ${COLORS.border}`,
                    boxShadow:       '0 1px 3px rgba(124,58,237,0.08)',
                },
            },
        },

        MuiToolbar: {
            styleOverrides: {
                root: { minHeight: '60px !important' },
            },
        },

        // ── Drawer / Sidebar ──────────────────────────────────────────────
        // MuiDrawer: {
        //     styleOverrides: {
        //         paper: {
        //             border:          'none',
        //             backgroundColor: COLORS.sidebarBg,
        //             color:           COLORS.sidebarText,
        //         },
        //     },
        // },

        // ── ListItemButton — pozycje w sidebarze ─────────────────────────
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius:  8,
                    margin:        '1px 8px',
                    width:         'calc(100% - 16px)',
                    padding:       '8px 10px',
                    fontSize:      '13.5px',
                    fontWeight:    500,
                    color:         COLORS.sidebarText,
                    transition:    'all 0.15s',
                    '&:hover': {
                        backgroundColor: COLORS.sidebarHover,
                        color:           '#ffffff',
                    },
                    '&.Mui-selected': {
                        backgroundColor: COLORS.sidebarActive,
                        color:           '#ffffff',
                        fontWeight:      600,
                        boxShadow:       '0 2px 8px rgba(124,58,237,0.4)',
                        '&:hover': {
                            backgroundColor: COLORS.accentHover,
                        },
                        '& .MuiListItemIcon-root': {
                            color: '#ffffff',
                        },
                    },
                },
            },
        },

        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 32,
                    color:    COLORS.sidebarText,
                },
            },
        },

        MuiListItemText: {
            styleOverrides: {
                primary: {
                    fontSize:   '13.5px',
                    fontWeight: 'inherit',
                    color:      'inherit',
                },
            },
        },

        // ── Paper ─────────────────────────────────────────────────────────
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border:          `1px solid ${COLORS.border}`,
                    boxShadow:       '0 1px 3px rgba(124,58,237,0.08)',
                },
            },
        },

        // ── Button ────────────────────────────────────────────────────────
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    height:       38,
                    padding:      '0 14px',
                    fontSize:     '13px',
                    fontWeight:   600,
                    transition:   'all 0.15s',
                    boxShadow:    'none',
                    '&:hover':    { boxShadow: 'none' },
                },
                contained: {
                    backgroundColor: COLORS.accent,
                    color:           '#ffffff',
                    boxShadow:       '0 2px 8px rgba(124,58,237,0.35)',
                    '&:hover': {
                        backgroundColor: COLORS.accentHover,
                        boxShadow:       '0 4px 12px rgba(124,58,237,0.4)',
                    },
                },
                // Nadpisuje ogólny `contained` dla color="error"
                containedError: {
                    backgroundColor: COLORS.danger,
                    color:           '#ffffff',
                    boxShadow:       '0 2px 8px rgba(220,38,38,0.30)',
                    '&:hover': {
                        backgroundColor: '#b91c1c',
                        boxShadow:       '0 4px 12px rgba(220,38,38,0.40)',
                    },
                },
                outlined: {
                    borderColor:     COLORS.border,
                    color:           COLORS.textSecondary,
                    backgroundColor: COLORS.bgSurface,
                    boxShadow:       '0 1px 3px rgba(124,58,237,0.08)',
                    '&:hover': {
                        borderColor:     COLORS.borderStrong,
                        color:           COLORS.textPrimary,
                        backgroundColor: COLORS.bgSurface,
                    },
                },
                text: {
                    color: COLORS.textMuted,
                    '&:hover': {
                        backgroundColor: COLORS.accentDim,
                        color:           COLORS.accentText,
                    },
                },
                sizeSmall: {
                    height:  32,
                    padding: '0 10px',
                    fontSize:'12px',
                },
            },
        },

        // ── IconButton ────────────────────────────────────────────────────
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius:    8,
                    border:          `1px solid ${COLORS.border}`,
                    backgroundColor: COLORS.bgSurface,
                    color:           COLORS.textMuted,
                    boxShadow:       '0 1px 2px rgba(124,58,237,0.06)',
                    transition:      'all 0.15s',
                    '&:hover': {
                        backgroundColor: COLORS.accentDim,
                        borderColor:     COLORS.borderStrong,
                        color:           COLORS.accent,
                    },
                    '&.unlock-btn': {
                        color:           COLORS.warning,
                        borderColor:     COLORS.warningBorder,
                        backgroundColor: COLORS.warningBg,
                        '&:hover': {
                            backgroundColor: '#fef3c7',
                            borderColor:     '#f59e0b',
                        },
                        '&.Mui-disabled': {
                            opacity:         0.3,
                            backgroundColor: COLORS.warningBg,
                            borderColor:     COLORS.warningBorder,
                        },
                    },
                },
                sizeSmall: {
                    width:  28,
                    height: 28,
                    '& svg': { fontSize: '15px' },
                },
            },
        },

        // ── TextField ─────────────────────────────────────────────────────
        MuiTextField: {
            defaultProps: { size: 'small' },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontSize:        '13.5px',
                    backgroundColor: COLORS.bgSurface,
                    borderRadius:    8,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: COLORS.border,
                        transition:  'border-color 0.15s',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: COLORS.borderStrong,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: COLORS.accent,
                        borderWidth: '1px',
                    },
                },
                input: {
                    padding: '7px 12px',
                    color:   COLORS.textPrimary,
                    '&::placeholder': {
                        color:   COLORS.textMuted,
                        opacity: 1,
                    },
                },
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '13px',
                    color:    COLORS.textMuted,
                    '&.Mui-focused': { color: COLORS.accent },
                },
            },
        },

        // ── Tabela ────────────────────────────────────────────────────────
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border:       `1px solid ${COLORS.border}`,
                    boxShadow:    '0 4px 12px rgba(124,58,237,0.10)',
                    // overflow celowo pominięty — TableContainer sam obsługuje scroll
                },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: { backgroundColor: COLORS.bgMuted },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: '#f5f3ff',
                    padding:     '13px 16px',
                    fontSize:    '13px',
                    color:       COLORS.textSecondary,
                },
                head: {
                    backgroundColor: COLORS.bgMuted,
                    color:           COLORS.textMuted,
                    fontSize:        '11px',
                    fontWeight:      600,
                    textTransform:   'uppercase',
                    letterSpacing:   '0.6px',
                    padding:         '10px 16px',
                    whiteSpace:      'nowrap',
                },
            },
        },

        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background 0.1s',
                    '&:hover': {
                        backgroundColor: COLORS.bgMuted,
                    },
                    '&:last-child td': {
                        borderBottom: 'none',
                    },
                },
            },
        },

        // ── Chip ──────────────────────────────────────────────────────────
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontSize:     '11.5px',
                    fontWeight:   600,
                    height:       24,
                },
                colorSuccess: {
                    backgroundColor: COLORS.successBg,
                    color:           COLORS.success,
                    border:          `1px solid ${COLORS.successBorder}`,
                },
                colorWarning: {
                    backgroundColor: COLORS.warningBg,
                    color:           COLORS.warning,
                    border:          `1px solid ${COLORS.warningBorder}`,
                },
                colorError: {
                    backgroundColor: COLORS.dangerBg,
                    color:           COLORS.danger,
                    border:          `1px solid ${COLORS.dangerBorder}`,
                },
            },
        },

        // ── Alert ─────────────────────────────────────────────────────────
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontSize:     '13px',
                    border:       '1px solid transparent',
                },
                standardSuccess: {
                    backgroundColor: COLORS.successBg,
                    color:           COLORS.success,
                    borderColor:     COLORS.successBorder,
                },
                standardWarning: {
                    backgroundColor: COLORS.warningBg,
                    color:           COLORS.warning,
                    borderColor:     COLORS.warningBorder,
                },
                standardError: {
                    backgroundColor: COLORS.dangerBg,
                    color:           COLORS.danger,
                    borderColor:     COLORS.dangerBorder,
                },
                standardInfo: {
                    backgroundColor: COLORS.accentDim,
                    color:           COLORS.accentText,
                    borderColor:     '#ddd6fe',
                },
            },
        },

        // ── Dialog ────────────────────────────────────────────────────────
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    boxShadow:    '0 8px 30px rgba(124,58,237,0.15)',
                    border:       `1px solid ${COLORS.border}`,
                },
            },
        },

        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize:   '15px',
                    fontWeight: 700,
                    color:      COLORS.textPrimary,
                    padding:    '18px 22px 12px',
                },
            },
        },

        MuiDialogContent: {
            styleOverrides: {
                root: { padding: '12px 22px' },
            },
        },

        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding:   '12px 22px',
                    borderTop: `1px solid ${COLORS.border}`,
                    gap:       6,
                },
            },
        },

        // ── Drawer override dla Paper wewnątrz Drawera ────────────────────
        // Paper globalnie dostaje border — Drawer musi go nadpisać
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    border:          'none',
                    backgroundColor: COLORS.sidebarBg,
                    color:           COLORS.sidebarText,
                    boxShadow:       'none',
                },
            },
        },

        // ── Skeleton ──────────────────────────────────────────────────────
        MuiSkeleton: {
            styleOverrides: {
                root: {
                    backgroundColor: COLORS.accentDim,
                    borderRadius:    8,
                },
            },
        },

        // ── Tooltip ───────────────────────────────────────────────────────
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: COLORS.textPrimary,
                    fontSize:        '12px',
                    fontWeight:      400,
                    borderRadius:    6,
                    padding:         '5px 10px',
                },
                arrow: { color: COLORS.textPrimary },
            },
        },

        // ── Snackbar ──────────────────────────────────────────────────────
        MuiSnackbar: {
            defaultProps: {
                anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            },
        },

        // ── Select ────────────────────────────────────────────────────────
        MuiSelect: {
            styleOverrides: {
                icon: { color: COLORS.textMuted },
            },
        },

        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    boxShadow:    '0 4px 12px rgba(124,58,237,0.12)',
                    border:       `1px solid ${COLORS.border}`,
                    marginTop:    4,
                },
            },
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '13px',
                    padding:  '7px 14px',
                    '&:hover': {
                        backgroundColor: COLORS.accentDim,
                        color:           COLORS.accentText,
                    },
                    '&.Mui-selected': {
                        backgroundColor: COLORS.accentDim,
                        color:           COLORS.accentText,
                        fontWeight:      600,
                    },
                },
            },
        },

        // ── Tabs (Q2Modal) ────────────────────────────────────────────────
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize:      '13px',
                    fontWeight:    500,
                    textTransform: 'none',
                    color:         COLORS.textMuted,
                    '&.Mui-selected': {
                        color:      COLORS.accent,
                        fontWeight: 600,
                    },
                },
            },
        },

        MuiTabs: {
            styleOverrides: {
                indicator: { backgroundColor: COLORS.accent },
            },
        },
    },
})

export default theme