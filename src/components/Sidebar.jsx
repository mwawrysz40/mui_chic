// src/components/Sidebar.jsx
import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse"; // 🔥 Nowy import

// Ikony
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech"; // Ikona dla Laboratorium
import AssessmentIcon from "@mui/icons-material/Assessment"; // Ikona dla Wyników próbek
import ExpandLess from "@mui/icons-material/ExpandLess"; // 🔥 Ikona strzałki w górę
import ExpandMore from "@mui/icons-material/ExpandMore"; // 🔥 Ikona strzałki w dół

import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // 🔥 Stan sprawdzający czy menu Laboratorium jest rozwinięte.
    // Domyślnie otwarte, jeśli jesteśmy na stronie Próbki lub Wyniki
    const [openLab, setOpenLab] = useState(
        location.pathname === "/probki" || location.pathname === "/wyniki"
    );

    const handleLabClick = () => {
        setOpenLab(!openLab);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box"
                }
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
                <List>
                    {/* --- Zakładka: Dashboard --- */}
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={location.pathname === "/"}
                            onClick={() => navigate("/")}
                        >
                            <ListItemIcon><DashboardIcon /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>

                    {/* --- Kategoria główna: Laboratorium --- */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLabClick}>
                            <ListItemIcon><BiotechIcon /></ListItemIcon>
                            <ListItemText primary="Laboratorium" />
                            {openLab ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>

                    {/* --- Podmenu dla Laboratorium --- */}
                    <Collapse in={openLab} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>

                            {/* Podzakładka: Próbki */}
                            <ListItemButton
                                sx={{ pl: 4 }} // 🔥 pl: 4 dodaje wcięcie (padding-left)
                                selected={location.pathname === "/probki"}
                                onClick={() => navigate("/probki")}
                            >
                                <ListItemIcon><ScienceIcon /></ListItemIcon>
                                <ListItemText primary="Próbki" />
                            </ListItemButton>

                            {/* Podzakładka: Wyniki próbek */}
                            <ListItemButton
                                sx={{ pl: 4 }}
                                selected={location.pathname === "/wyniki"}
                                onClick={() => navigate("/wyniki")}
                            >
                                <ListItemIcon><AssessmentIcon /></ListItemIcon>
                                <ListItemText primary="Wynik próbek" />
                            </ListItemButton>

                        </List>
                    </Collapse>

                </List>
            </Box>
        </Drawer>
    );
}