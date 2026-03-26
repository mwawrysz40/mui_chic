// src/components/Logo.jsx
// Użycie w Header.jsx:
//   import Logo from './Logo'
//   <Logo size={32} />

export default function Logo({ size = 32 }) {
    const s = size
    const r = Math.round(s * 0.18)  // border-radius proporcjonalny

    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 56 56"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
        >
            {/* Tło */}
            <rect width="56" height="56" rx={r} fill="#4f46e5"/>

            {/* Węzeł lewy górny */}
            <circle cx="16" cy="18" r="6" fill="none" stroke="white" strokeWidth="2.5"/>
            {/* Węzeł prawy górny */}
            <circle cx="40" cy="18" r="6" fill="none" stroke="white" strokeWidth="2.5"/>
            {/* Węzeł dolny środkowy */}
            <circle cx="28" cy="38" r="6" fill="none" stroke="white" strokeWidth="2.5"/>

            {/* Linia lewy górny → prawy górny */}
            <line x1="22" y1="18" x2="34" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            {/* Linia lewy górny → dolny środkowy */}
            <line x1="19" y1="23" x2="25" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            {/* Linia prawy górny → dolny środkowy */}
            <line x1="37" y1="23" x2="31" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round"/>

            {/* Kropki wypełnione w centrach węzłów — akcent */}
            <circle cx="16" cy="18" r="2.5" fill="white"/>
            <circle cx="40" cy="18" r="2.5" fill="white"/>
            <circle cx="28" cy="38" r="2.5" fill="white"/>
        </svg>
    )
}