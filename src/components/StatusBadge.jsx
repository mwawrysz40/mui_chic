// src/components/StatusBadge.jsx
//
// Kolorowy badge dla wartości statusowych w tabelach.
// Jeśli wartość nie ma zdefiniowanego koloru w statusBadgeConfig.js,
// renderuje zwykły tekst bez ramki.

import React from 'react';
import { STATUS_COLORS } from '../config/statusBadgeConfig';

export default function StatusBadge({ value }) {
    if (!value && value !== 0) return <>—</>;

    const style = STATUS_COLORS[String(value).trim().toUpperCase()];

    if (!style) return <>{value}</>;

    return (
        <span style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '5px',
            padding:        '2px 8px',
            borderRadius:   '4px',
            fontSize:       '11.5px',
            fontWeight:     500,
            whiteSpace:     'nowrap',
            backgroundColor: style.bg,
            color:           style.color,
            border:          `1px solid ${style.border}`,
        }}>
            <span style={{
                width:        '5px',
                height:       '5px',
                borderRadius: '50%',
                backgroundColor: style.color,
                flexShrink:   0,
            }}/>
            {value}
        </span>
    );
}