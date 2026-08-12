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

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useAccess } from "../auth/access";
import { DRAWER_WIDTH } from "../config/constants";
import Logo from "./Logo";

// Styl nagłówka sekcji — wspólny dla wszystkich sekcji menu.
const SECTION_LABEL_SX = {
    fontSize:      "10px",
    fontWeight:    600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color:         "rgba(196,181,253,0.45)",
    px:            2.5,
    py:            1,
    mt:            1,
};

export default function Sidebar() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { user }  = useAuth();
    const { sections } = useAccess();

    // Rozwinięte pozycje z podmenu — domyślnie te, w których jest aktywna trasa.
    const [openItems, setOpenItems] = useState(() =>
        Object.fromEntries(
            sections.flatMap((section) =>
                section.items
                    .filter((item) => item.children)
                    .map((item) => [
                        item.id,
                        item.children.some((c) => c.path === location.pathname),
                    ]),
            ),
        )
    );

    const toggleItem = (id) =>
        setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));

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
            {/* Sekcje i uprawnienia pochodzą z src/config/navigation.js —
                useAccess() zwraca tylko te, które użytkownik może zobaczyć. */}
            <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
                {sections.map((section) => (
                    <React.Fragment key={section.id}>
                        <Typography sx={SECTION_LABEL_SX}>{section.label}</Typography>

                        <List disablePadding>
                            {section.items.map((item) => {
                                const Icon = item.icon;

                                // Pozycja z podmenu — rozwijana lista tras podrzędnych.
                                if (item.children) {
                                    const open = Boolean(openItems[item.id]);

                                    return (
                                        <React.Fragment key={item.id}>
                                            <ListItem disablePadding>
                                                <ListItemButton onClick={() => toggleItem(item.id)}>
                                                    <ListItemIcon><Icon sx={{ fontSize: 18 }} /></ListItemIcon>
                                                    <ListItemText primary={item.label} />
                                                    {open
                                                        ? <ExpandLess sx={{ fontSize: 16, color: "rgba(196,181,253,0.5)" }} />
                                                        : <ExpandMore sx={{ fontSize: 16, color: "rgba(196,181,253,0.5)" }} />
                                                    }
                                                </ListItemButton>
                                            </ListItem>

                                            <Collapse in={open} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {item.children.map((child) => {
                                                        const ChildIcon = child.icon;
                                                        return (
                                                            <ListItemButton
                                                                key={child.id}
                                                                sx={{ pl: 4.5 }}
                                                                selected={location.pathname === child.path}
                                                                onClick={() => navigate(child.path)}
                                                            >
                                                                <ListItemIcon><ChildIcon sx={{ fontSize: 16 }} /></ListItemIcon>
                                                                <ListItemText primary={child.label} />
                                                            </ListItemButton>
                                                        );
                                                    })}
                                                </List>
                                            </Collapse>
                                        </React.Fragment>
                                    );
                                }

                                return (
                                    <ListItem key={item.id} disablePadding>
                                        <ListItemButton
                                            selected={location.pathname === item.path}
                                            onClick={() => navigate(item.path)}
                                        >
                                            <ListItemIcon><Icon sx={{ fontSize: 18 }} /></ListItemIcon>
                                            <ListItemText primary={item.label} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </React.Fragment>
                ))}
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