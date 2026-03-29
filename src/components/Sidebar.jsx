// src/components/Sidebar.jsx
import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { DRAWER_WIDTH } from "../config/constants";
import Logo from "./Logo";

export default function Sidebar() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { user }  = useAuth();

    const [openLab, setOpenLab] = useState(
        location.pathname === "/probki" || location.pathname === "/wyniki"
    );

    // Inicjały użytkownika do avatara
    const hasFullName = user?.firstName?.trim() && user?.lastName?.trim();
    const initials = hasFullName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : user?.username?.[0]?.toUpperCase() || "?";

    const displayName = hasFullName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || "Użytkownik";

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* ── Logo + nazwa ── */}
            <Box sx={{
                display:     "flex",
                alignItems:  "center",
                gap:         1.2,
                px:          2.5,
                py:          2,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                <Logo size={30} />
                <Typography sx={{
                    fontSize:      "15px",
                    fontWeight:    700,
                    color:         "#ffffff",
                    letterSpacing: "-0.3px",
                }}>
                    CHIC ERP
                </Typography>
                {/* Badge PRO */}
                <Box sx={{
                    fontSize:        "10px",
                    fontWeight:      600,
                    color:           "#a78bfa",
                    bgcolor:         "rgba(124,58,237,0.25)",
                    px:              0.8,
                    py:              0.2,
                    borderRadius:    "4px",
                    letterSpacing:   "0.5px",
                    ml:              0.5,
                }}>
                    PRO
                </Box>
            </Box>

            {/* ── Nawigacja ── */}
            <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>

                {/* Sekcja: Główne */}
                <Typography sx={{
                    fontSize:      "10px",
                    fontWeight:    600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color:         "rgba(196,181,253,0.45)",
                    px:            2.5,
                    py:            1,
                    mt:            1,
                }}>
                    Główne
                </Typography>

                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={location.pathname === "/"}
                            onClick={() => navigate("/")}
                        >
                            <ListItemIcon><DashboardIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                            <ListItemText primary="Pulpit Sterowniczy" />
                        </ListItemButton>
                    </ListItem>
                </List>

                {/* Sekcja: Laboratorium */}
                <Typography sx={{
                    fontSize:      "10px",
                    fontWeight:    600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color:         "rgba(196,181,253,0.45)",
                    px:            2.5,
                    py:            1,
                    mt:            1,
                }}>
                    Laboratorium
                </Typography>

                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setOpenLab(!openLab)}>
                            <ListItemIcon><BiotechIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                            <ListItemText primary="Próbki i Serie" />
                            {openLab
                                ? <ExpandLess sx={{ fontSize: 16, color: "rgba(196,181,253,0.5)" }} />
                                : <ExpandMore sx={{ fontSize: 16, color: "rgba(196,181,253,0.5)" }} />
                            }
                        </ListItemButton>
                    </ListItem>

                    <Collapse in={openLab} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4.5 }}
                                selected={location.pathname === "/probki"}
                                onClick={() => navigate("/probki")}
                            >
                                <ListItemIcon><ScienceIcon sx={{ fontSize: 16 }} /></ListItemIcon>
                                <ListItemText primary="Próbki" />
                            </ListItemButton>

                            <ListItemButton
                                sx={{ pl: 4.5 }}
                                selected={location.pathname === "/wyniki"}
                                onClick={() => navigate("/wyniki")}
                            >
                                <ListItemIcon><AssessmentIcon sx={{ fontSize: 16 }} /></ListItemIcon>
                                <ListItemText primary="Wyniki Analiz" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Box>

            {/* ── Karta użytkownika na dole ── */}
            <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", p: 1.5 }}>
                <Box sx={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          1.2,
                    px:           1,
                    py:           0.8,
                    borderRadius: "8px",
                    cursor:       "pointer",
                    transition:   "background 0.15s",
                    "&:hover":    { bgcolor: "rgba(255,255,255,0.06)" },
                }}>
                    {/* Avatar */}
                    <Box sx={{
                        width:        32,
                        height:       32,
                        borderRadius: "50%",
                        bgcolor:      "#7c3aed",
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                        fontSize:     "12px",
                        fontWeight:   700,
                        color:        "#fff",
                        flexShrink:   0,
                        boxShadow:    "0 0 0 2px rgba(167,139,250,0.4)",
                    }}>
                        {initials}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{
                            fontSize:  "13px",
                            fontWeight: 600,
                            color:     "#ffffff",
                            lineHeight: 1.3,
                            overflow:  "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                            {displayName}
                        </Typography>
                        <Typography sx={{
                            fontSize: "11px",
                            color:    "rgba(196,181,253,0.6)",
                            lineHeight: 1.2,
                        }}>
                            {user?.email || "Laborant"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}