// src/components/NoAccess.jsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function NoAccess({ groups }) {
    return (
        <Box sx={{
            flexGrow:       1,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            gap:            1.5,
            p:              4,
            textAlign:      "center",
        }}>
            <LockOutlinedIcon sx={{ fontSize: 44, color: "text.disabled" }} />
            <Typography variant="h6" fontWeight={700}>
                Brak uprawnień
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
                Nie masz dostępu do tej sekcji.
                {groups?.length
                    ? ` Wymagana grupa: ${groups.join(" lub ")}.`
                    : ""}
                {" "}Skontaktuj się z administratorem systemu.
            </Typography>
        </Box>
    );
}