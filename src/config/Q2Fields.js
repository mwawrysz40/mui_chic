// src/config/Q2Fields.js
//
// Każde pole może opcjonalnie mieć:
//   col  — szerokość w jednostkach MUI Grid (1–12). Brak = domyślne 4 (czyli 3 kolumny na ekranie md+)
//   row  — numer rzędu (1, 2, 3...). Pola z tym samym row trafiają do tego samego wiersza.
//          Brak = pola układają się kolejno, tak jak dotychczas.
//
// Przykład:
//   { id: "NrSample", col: 4, row: 1 }   → pierwsze pole, rząd 1, szerokość 4/12
//   { id: "Batch",    col: 4, row: 1 }   → drugi pole, ten sam rząd 1
//   { id: "Comments", col: 12, row: 2 }  → osobny rząd 2, pełna szerokość
//
// WAŻNE: col i row są OPCJONALNE. Jeśli żadne pole w zakładce ich nie ma,
// zakładka renderuje się dokładnie tak samo jak przed zmianą.

export const Q2Tabs = [
    {
        id: "general",
        label: "Dane ogólne",
        fields: [
            // Rząd 1 — pola identyfikacyjne (tylko do odczytu)
            { id: "NrSample",   label: "Nr próbki",   type: "text", disabled: true},
            { id: "SampleId",   label: "ID próbki",   type: "text", disabled: true},
            { id: "Batch",      label: "Partia",      type: "text", disabled: true},

            // Rząd 2 — komponent + daty
            { id: "Component",    label: "Komponent",      type: "text", disabled: true},
            { id: "DatePacking",  label: "Data pakowania", type: "date"},

            // Rząd 3 — osoby weryfikujące
            {
                id: "VeryfiPersonSFG", label: "Osoba weryfikująca SFG", type: "select",
                options: [
                    { label: "Anna Wajs",                value: "Anna Wajs" },
                    { label: "Agnieszka Śniadecka",      value: "Agnieszka Śniadecka" },
                    { label: "Ida Cierpka-Okoń",         value: "Ida Cierpka-Okoń" },
                    { label: "Konrelia Prauzińska",      value: "Konrelia Prauzińska" },
                    { label: "Monika Ziąbka",            value: "Monika Ziąbka" },
                    { label: "Zuzanna Aleksandrowicz",   value: "Zuzanna Aleksandrowicz" },
                ],
            },
            {
                id: "VeryfiPersonFG", label: "Osoba weryfikująca FG", type: "select",
                options: [
                    { label: "Anna Wajs",                value: "Anna Wajs" },
                    { label: "Agnieszka Śniadecka",      value: "Agnieszka Śniadecka" },
                    { label: "Ida Cierpka-Okoń",         value: "Ida Cierpka-Okoń" },
                    { label: "Konrelia Prauzińska",      value: "Konrelia Prauzińska" },
                    { label: "Monika Ziąbka",            value: "Monika Ziąbka" },
                    { label: "Zuzanna Aleksandrowicz",   value: "Zuzanna Aleksandrowicz" },
                ],
            },

            // Rząd 4 — status + archiwizacja
            {
                id: "Status", label: "Status", type: "select",
                options: [
                    { label: "ZGODNY",    value: "ZGODNY" },
                    { label: "NIEZGODNY", value: "NIEZGODNY" },
                ],
            },
            {
                id: "ArchiPacking", label: "Opakowanie archiwizacyjne", type: "select",
                options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" },
                ],
            },

            // Rząd 5 — hibary i partia bazy
            { id: "HibAro",   label: "Hibar aromatu", type: "text"},
            { id: "HibBaz",   label: "Hibar bazy",    type: "text"},
            { id: "BatchBaz", label: "Partia bazy",   type: "text"},

            // Rząd 6 — komentarz na całą szerokość
            { id: "Comments", label: "Komentarz", type: "text"},
        ],
    },
    {
        id: "niko",
        label: "Nikotyna",
        fields: [
            // Rząd 1 — moc + próbki obok siebie
            { id: "NikoM",    label: "Moc nikotyny", type: "number", disabled: true},
            { id: "NikoPR1",  label: "Próbka 1",     type: "number"},
            { id: "NikoPR2",  label: "Próbka 2",     type: "number"},

            // Rząd 2 — wyniki RAG obok siebie
            { id: "NikoRAG1", label: "RAG1", type: "text", disabled: true},
            { id: "NikoRAG2", label: "RAG2", type: "text", disabled: true},
        ],
    },

    // Pozostałe zakładki bez col/row — renderują się jak dotychczas
    {
        id: "weights",
        label: "Wagi",
        fields: [
            ...Array.from({ length: 20 }).map((_, i) => ({
                id: `WeightPR${i + 1}`,
                label: `Próbka ${i + 1}`,
                type: "number",
            })),
            { id: "WeightR", label: "R", type: "number" },
            { id: "WeightA", label: "A", type: "number" },
            { id: "WeightG", label: "G", type: "number" },
        ],
    },
    {
        id: "heights",
        label: "Wysokość",
        fields: [
            ...Array.from({ length: 20 }).map((_, i) => ({
                id: `HeightPR${i + 1}`,
                label: `Próbka ${i + 1}`,
                type: "number",
            })),
            { id: "HeightR", label: "R", type: "number" },
            { id: "HeightA", label: "A", type: "number" },
            { id: "HeightG", label: "G", type: "number" },
        ],
    },
    {
        id: "dropper",
        label: "Kroplomierz",
        fields: [
            { id: "DroppR",    label: "R",          type: "number", col: 1, row: 1 },
            { id: "DroppA",    label: "A",          type: "number", col: 2, row: 1 },
            { id: "DroppG",    label: "G",          type: "number", col: 3, row: 1 },
            { id: "DroppCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.2.1A Brak odpowiedniego kształtu",          value: "6.2.1A Brak odpowiedniego kształtu"},
                    { label: "6.2.2A Uszkodzony",            			    value: "6.2.2A Uszkodzony" },
                    { label: "6.2.3A Niewłaściwy kolor",            		value: "6.2.3A Niewłaściwy kolor" },
                    { label: "6.2.4A Zanieczyszczony",            			value: "6.2.4A Zanieczyszczony" },
                    { label: "6.2.5A Niewłaściwie zaaplikowany",            value: "6.2.5A Niewłaściwie zaaplikowany" },
                    { label: "6.2.6A Brak",            			            value: "6.2.6A Brak" },

                ] },
            { id: "DroppDesA", label: "Opis wady A", type: "text", col: 1, row: 3 },
            { id: "DroppCatB", label: "Kategoria wady B", type: "select",col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.2.1B Brak odpowiedniego kształtu",          value: "6.2.1B Brak odpowiedniego kształtu"},
                    { label: "6.2.2B Uszkodzony",            			    value: "6.2.2B Uszkodzony" },
                    { label: "6.2.4B Zanieczyszczony",            			value: "6.2.4B Zanieczyszczony" },

                ] },
            { id: "_spacer1", type: "spacer", row: 2 },
            { id: "DroppDesB", label: "Opis wady B", type: "text", col: 2, row: 3 },
            { id: "_spacer2", type: "spacer", row: 3 },
        ],
    },
    {
        id: "bottle",
        label: "Butelka",
        fields: [
            { id: "BottleR",    label: "R",          type: "number", col: 1, row: 1 },
            { id: "BottleA",    label: "A",          type: "number", col: 2, row: 1 },
            { id: "BottleG",    label: "G",          type: "number", col: 3, row: 1 },
            { id: "BottleCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.1.1A Brak odpowiedniego kształtu",          value: "6.1.1A Brak odpowiedniego kształtu"},
                    { label: "6.1.2A Uszkodzona",            				value: "6.1.2A Uszkodzona" },
                    { label: "6.1.3A Niewłaściwy kolor",                    value: "6.1.3A Niewłaściwy kolor" },
                    { label: "6.1.4A Zanieczyszczona",                    	value: "6.1.4A Zanieczyszczona" },
                    { label: "6.1.5A Nieszczelna",                          value: "6.1.5A Nieszczelna" },

                ] },
            { id: "BottleDesA", label: "Opis wady A", type: "text", col: 1, row: 3 },
            { id: "BottleCatB", label: "Kategoria wady B", type: "select",col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.1.1B Brak odpowiedniego kształtu",          value: "6.1.1B Brak odpowiedniego kształtu"},
                    { label: "6.1.4B Zanieczyszczona",            			value: "6.1.4B Zanieczyszczona" },

                ] },
            { id: "_spacer3", type: "spacer", row: 2 },
            { id: "BottleDesB", label: "Opis wady B", type: "text", col: 2, row: 3 },
            { id: "_spacer4", type: "spacer", row: 3 },
        ],
    },
    {
        id: "cap",
        label: "Nakrętka",
        fields: [
            { id: "CapR",    label: "R",          type: "number", col: 1, row: 1 },
            { id: "CapA",    label: "A",          type: "number", col: 2, row: 1 },
            { id: "CapG",    label: "G",          type: "number", col: 3, row: 1 },
            { id: "CapCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.3.1A Brak odpowiedniego kształtu",         	    value: "6.3.1A Brak odpowiedniego kształtu"},
                    { label: "6.3.2A Niepełny kształt",            			    value: "6.3.2A Niepełny kształt" },
                    { label: "6.3.3A Uszkodzona",            					value: "6.3.3A Uszkodzona" },
                    { label: "6.3.4A Nadmiar materiału",            			value: "6.3.4A Nadmiar materiału" },
                    { label: "6.3.5A Niewłaściwy kolor",            			value: "6.3.5A Niewłaściwy kolor" },
                    { label: "6.3.6A Zanieczyszczona",            				value: "6.3.6A Zanieczyszczona" },
                    { label: "6.3.7A Brak plomby",            					value: "6.3.7A Brak plomby" },
                    { label: "6.3.8A Podwójna plomba",            				value: "6.3.8A Podwójna plomba" },
                    { label: "6.3.9A Przekrzywiona",            				value: "6.3.9A Przekrzywiona" },
                    { label: "6.3.11A Zerwane wąsy plomby",            			value: "6.3.11A Zerwane wąsy plomby" },
                    { label: "6.3.12A Niedokręcona nakrętka",            		value: "6.3.12A Niedokręcona nakrętka" },
                    { label: "6.3.13A Przekręcona nakrętka",            		value: "6.3.13A Przekręcona nakrętka" },

                ] },
            { id: "CapDesA", label: "Opis wady A", type: "text" , col: 1, row: 3},
            { id: "CapCatB", label: "Kategoria wady B", type: "select",col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.3.5B Niewłaściwy kolor",         				value: "6.3.5B Niewłaściwy kolor"},
                    { label: "6.3.10B Niezrywająca się plomba",            		value: "6.3.10B Niezrywająca się plomba" },
                    { label: "6.3.11B Zerwane wąsy plomby",            			value: "6.3.11B Zerwane wąsy plomby" },
                    { label: "6.3.12B Niedokręcona nakrętka",            		value: "6.3.12B Niedokręcona nakrętka" },
                    { label: "6.3.13B Przekręcona nakrętka",            		value: "6.3.13B Przekręcona nakrętka" },

                ] },
            { id: "_spacer5", type: "spacer", row: 2 },
            { id: "CapDesB", label: "Opis wady B", type: "text",  col: 2, row: 3 },
            { id: "_spacer6", type: "spacer", row: 3 },
        ],
    },
    {
        id: "label",
        label: "Etykieta",
        fields: [
            { id: "LabelR",    label: "R",          type: "number", col: 1, row: 1  },
            { id: "LabelA",    label: "A",          type: "number", col: 2, row: 1  },
            { id: "LabelG",    label: "G",          type: "number", col: 3, row: 1  },
            { id: "LabelCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.4.1A Nieczytelna partia",                    		value: "6.4.1A Nieczytelna partia" },
                    { label: "6.4.1A Zniekształcone dane partii",            		value: "6.4.1A Zniekształcone dane partii" },
                    { label: "6.4.2A Wady graficzne",                        		value: "6.4.2A Wady graficzne" },
                    { label: "6.4.3A Niewłaściwy materiał",                  		value: "6.4.3A Niewłaściwy materiał" },
                    { label: "6.4.4A Różnice kolorystyczne",                 		value: "6.4.4A Różnice kolorystyczne" },
                    { label: "6.4.5A Niewłaściwe nawinięcie",                		value: "6.4.5A Niewłaściwe nawinięcie" },
                    { label: "6.4.6A Uszkodzenia",                           		value: "6.4.6A Uszkodzenia" },
                    { label: "6.4.7A Niewłaściwy wykrój",                    		value: "6.4.7A Niewłaściwy wykrój" },
                    { label: "6.4.8A Połączenie materiałów",                 		value: "6.4.8A Połączenie materiałów"},
                    { label: "6.4.9A Brak etykiety na podkładzie",           		value: "6.4.9A Brak etykiety na podkładzie" },
                    { label: "6.4.10A Nadmiar kleju",                        		value: "6.4.10A Nadmiar kleju" },
                    { label: "6.4.11A Podwójna etykieta",                    		value: "6.4.11A Podwójna etykieta" },
                    { label: "6.4.12A Odklejona etykieta",                   		value: "6.4.12A Odklejona etykieta" },
                    { label: "6.4.13A Niewłaścwie zabezpieczenie powierzchni", 		value: "6.4.13A Niewłaścwie zabezpieczenie powierzchni" },
                    { label: "6.4.14A Przesztancowany podkład",              		value: "6.4.14A Przesztancowany podkład" },
                    { label: "6.4.15A Niewłaściwa wysokość aplikacji na butelkę", 	value: "6.4.15A Niewłaściwa wysokość aplikacji na butelkę" },
                ] },
            { id: "LabelDesA", label: "Opis wady A", type: "text", col: 1, row: 3  },
            { id: "LabelCatB", label: "Kategoria wady B", type: "select",col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.4.2B Wady graficzne",                    			value: "6.4.2B Wady graficzne" },
                    { label: "6.4.4B Różnice kolorystyczne",            			value: "6.4.4B Różnice kolorystyczne" },
                    { label: "6.4.6B Uszkodzenia",                        			value: "6.4.6B Uszkodzenia" },
                    { label: "6.4.15B Niewłaściwa wysokość aplikacji na butelkę",   value: "6.4.15B Niewłaściwa wysokość aplikacji na butelkę" },

                ] },
            { id: "_spacer7", type: "spacer", row: 2 },
            { id: "LabelDesB", label: "Opis wady B", type: "text", col: 2, row: 3   },
            { id: "_spacer8", type: "spacer", row: 3 },
        ],
    },
    {
        id: "sniffing",
        label: "Zapach",
        fields: [
            { id: "SniffR", label: "R", type: "number" },
            { id: "SniffA", label: "A", type: "number" },
            { id: "SniffG", label: "G", type: "number" },
        ],
    },
    {
        id: "contamination",
        label: "Płyn",
        fields: [
            { id: "ContamR",   label: "R",      type: "number", col: 1, row: 1 },
            { id: "ContamA",   label: "A",      type: "number", col: 2, row: 1 },
            { id: "ContamG",   label: "G",      type: "number", col: 3, row: 1 },
            { id: "ContamCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.8.1A Zanieczyszczony",         				    value: "6.8.1A Zanieczyszczony"},
                    { label: "6.8.2A Wizualna zmiana wyglądu",            		value: "6.8.2A Wizualna zmiana wyglądu" },
                    { label: "6.8.3A Nieprawidłowa ilość",            			value: "6.8.3A Nieprawidłowa ilość" },
                    { label: "6.8.4A Niewłaściwy komponent do produkcji",       value: "6.8.4A Niewłaściwy komponent do produkcji" },

                ] },
            { id: "ContamDesA", label: "Opis wady A",   type: "text",col: 1, row: 3 },
            { id: "ContamCatB", label: "Kategoria wady B", type: "select",col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.8.2B Wizualna zmiana wyglądu",            		value: "6.8.2B Wizualna zmiana wyglądu" },

                ] },
            { id: "_spacer9", type: "spacer", row: 2 },
            { id: "ContamDesB", label: "Opis wady B",   type: "text",col: 2, row: 3 },
            { id: "_spacer10", type: "spacer", row: 3 },
        ],
    },
    {
        id: "mastercase",
        label: "MasterCase",
        fields: [
            { id: "MasterCaseR",    label: "R",          type: "number", col: 1, row: 1 },
            { id: "MasterCaseA",    label: "A",          type: "number", col: 2, row: 1 },
            { id: "MasterCaseG",    label: "G",          type: "number", col: 3, row: 1 },
            { id: "MastercaseCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.7.1A Nieprawidłowo przyklejona etykieta",                    value: "6.7.1A Nieprawidłowo przyklejona etykieta" },
                    { label: "6.7.3A Uszkodzony",                                            value: "6.7.3A Uszkodzony" },
                ] },
            { id: "MasterCaseDesA", label: "Opis wady A", type: "text", col: 1, row: 3  },
            { id: "MasterCaseCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.7.1B Nieprawidłowo przyklejona etykieta",                    value: "6.7.1B Nieprawidłowo przyklejona etykieta" },
                    { label: "6.7.2B Brak podpisu osoby pakującej",                          value: "6.7.2B Brak podpisu osoby pakującej" },
                    { label: "6.7.3B Uszkodzony",                                            value: "6.7.3B Uszkodzony" },
                ] },
            { id: "_spacer11", type: "spacer", row: 2 },
            { id: "MasterCaseDesB", label: "Opis wady B", type: "text", col: 2, row: 3   },
            { id: "_spacer12", type: "spacer", row: 3 },
        ],
    },
    {
        id: "ctn",
        label: "Opakowanie jednostkowe",
        fields: [
            { id: "CtnR", label: "R", type: "number", col: 1, row: 1  },
            { id: "CtnA", label: "A", type: "number", col: 2, row: 1  },
            { id: "CtnG", label: "G", type: "number" ,col: 3, row: 1 },
            { id: "CtnCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.6.1A Nieczytelne napisy",                    value: "6.6.1A Nieczytelne napisy" },
                    { label: "6.6.2A Wady graficzne",                        value: "6.6.2A Wady graficzne" },
                    { label: "6.6.3A Niewłaściwy materiał",                  value: "6.6.3A Niewłaściwy materiał" },
                    { label: "6.6.4A Przesunięta grafika",                   value: "6.6.4A Przesunięta grafika" },
                    { label: "6.6.5A Różnice kolorystyczne",                 value: "6.6.5A Różnice kolorystyczne" },
                    { label: "6.6.6A Niewłaściwe złożenie",                  value: "6.6.6A Niewłaściwe złożenie" },
                    { label: "6.6.7A Uszkodzenia",                           value: "6.6.7A Uszkodzenia" },
                    { label: "6.6.12A Niezabezpieczony produkt",             value: "6.6.12A Niezabezpieczony produkt" },
                    { label: "6.6.13A Niewłaściwe zamknięcie opakowania",    value: "6.6.13A Niewłaściwe zamknięcie opakowania" },
                ] },
            { id: "CtnDesA", label: "Opis wady A", type: "text", col: 1, row: 3  },
            { id: "CtnCatB", label: "Kategoria wady B", type: "select", col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.6.2B Wady graficzne",                                        value: "6.6.2B Wady graficzne" },
                    { label: "6.6.4B Przesunięta grafika",                                   value: "6.6.4B Przesunięta grafika" },
                    { label: "6.6.5B Różnice kolorystyczne",                                 value: "6.6.5B Różnice kolorystyczne" },
                    { label: "6.6.7B Uszkodzenia",                                           value: "6.6.7B Uszkodzenia" },
                    { label: "6.6.8B Brak numeru partii i daty",                             value: "6.6.8B Brak numeru partii i daty" },
                    { label: "6.6.9B Nieczytelny numer partii",                              value: "6.6.9B Nieczytelny numer partii" },
                    { label: "6.6.10B Nieczytelny kod kreskowy",                             value: "6.6.10B Nieczytelny kod kreskowy" },
                    { label: "6.6.11B Numer partii nabity poza wyznaczonym obszarem",        value: "6.6.11B Numer partii nabity poza wyznaczonym obszarem" },
                    { label: "6.6.14B Niewłaściwe ułożenie w kartonie",                      value: "6.6.14B Niewłaściwe ułożenie w kartonie" },
                ] },
            { id: "_spacer13", type: "spacer", row: 2 },

            { id: "CtnDesB", label: "Opis wady B", type: "text", col: 2, row: 3  },
            { id: "_spacer14", type: "spacer", row: 3 },
        ],
    },
    {
        id: "srp",
        label: "Opakowanie zbiorcze",
        fields: [
            { id: "SrpR", label: "R", type: "number", col: 1, row: 1  },
            { id: "SrpA", label: "A", type: "number", col: 2, row: 1  },
            { id: "SrpG", label: "G", type: "number", col: 3, row: 1  },
            { id: "SrpCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2, options: [
                    { label: "---",                   value: "" },
                    { label: "6.6.1A Nieczytelne napisy",                   value: "6.6.1A Nieczytelne napisy" },
                    { label: "6.6.2A Wady graficzne",                       value: "6.6.2A Wady graficzne" },
                    { label: "6.6.3A Niewłaściwy materiał",                 value: "6.6.3A Niewłaściwy materiał" },
                    { label: "6.6.4A Przesunięta grafika",                  value: "6.6.4A Przesunięta grafika" },
                    { label: "6.6.5A Różnice kolorystyczne",                value: "6.6.5A Różnice kolorystyczne" },
                    { label: "6.6.6A Niewłaściwe złożenie",                 value: "6.6.6A Niewłaściwe złożenie" },
                    { label: "6.6.7A Uszkodzenia",                          value: "6.6.7A Uszkodzenia" },
                    { label: "6.6.12A Niezabezpieczony produkt",            value: "6.6.12A Niezabezpieczony produkt" },
                    { label: "6.6.13A Niewłaściwe zamknięcie opakowania",   value: "6.6.13A Niewłaściwe zamknięcie opakowania" },
                ] },
            { id: "SrpDesA", label: "Opis wady A", type: "text",col: 1, row: 3 },
            { id: "SrpCatB", label: "Kategoria wady B", type: "select",col: 2, row: 2, options: [
                    { label: "---",                   value: "" },
                    { label: "6.6.2B Wady graficzne",                                        value: "6.6.2B Wady graficzne" },
                    { label: "6.6.4B Przesunięta grafika",                                   value: "6.6.4B Przesunięta grafika" },
                    { label: "6.6.5B Różnice kolorystyczne",                                 value: "6.6.5B Różnice kolorystyczne" },
                    { label: "6.6.7B Uszkodzenia",                                           value: "6.6.7B Uszkodzenia" },
                    { label: "6.6.8B Brak numeru partii i daty",                             value: "6.6.8B Brak numeru partii i daty" },
                    { label: "6.6.9B Nieczytelny numer partii",                              value: "6.6.9B Nieczytelny numer partii" },
                    { label: "6.6.10B Nieczytelny kod kreskowy",                             value: "6.6.10B Nieczytelny kod kreskowy" },
                    { label: "6.6.11B Numer partii nabity poza wyznaczonym obszarem",        value: "6.6.11B Numer partii nabity poza wyznaczonym obszarem" },
                    { label: "6.6.14B Niewłaściwe ułożenie w kartonie",                      value: "6.6.14B Niewłaściwe ułożenie w kartonie" },
                ] },
            { id: "_spacer15", type: "spacer", row: 2 },
            { id: "SrDesB", label: "Opis wady B", type: "text",col: 2, row: 3 },
            { id: "_spacer16", type: "spacer", row: 3 },
        ],
    },
    {
        id: "tax",
        label: "Banderola",
        fields: [
            { id: "TaxStampR",    label: "R",          type: "number", col: 1, row: 1 },
            { id: "TaxStampA",    label: "A",          type: "number", col: 2, row: 1 },
            { id: "TaxStampG",    label: "G",          type: "number", col: 3, row: 1 },
            { id: "TaxStampCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.9.1A Odklejone",                    				value: "6.9.1A Odklejone"},
                    { label: "6.9.2A Wady graficzne",            					value: "6.9.2A Wady graficzne" },
                    { label: "6.9.3A Niewłaściwy materiał",                        	value: "6.9.3A Niewłaściwy materiał" },
                    { label: "6.9.5A Uszkodzenie",                        			value: "6.9.5A Uszkodzenie" },
                    { label: "6.9.6A Zniszczenie",                        			value: "6.9.6A Zniszczenie" },
                    { label: "6.9.7A Przesunięcie",                        			value: "6.9.7A Przesunięcie" },
                    { label: "6.9.8A Sklejone",                        				value: "6.9.8A Sklejone" },
                    { label: "6.9.9A Brak",                        					value: "6.9.9A Brak" },
                    { label: "6.9.10A Nadmiar",                        				value: "6.9.10A Nadmiar" },

                ] },
            { id: "TaxStampDesA", label: "Opis wady A", type: "text",col: 1, row: 3 },
            { id: "TaxStampCatB", label: "Kategoria wady B", type: "select",col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.9.2B Wady graficzne",                    	value: "6.9.2B Wady graficzne"},
                    { label: "6.9.4B Częściowo odklejona",            		value: "6.9.4B Częściowo odklejona" },
                    { label: "6.9.7B Przesunięcie",                        	value: "6.9.7B Przesunięcie" },

                ] },
            { id: "_spacer17", type: "spacer", row: 2 },
            { id: "TaxStampDesB", label: "Opis wady B", type: "text",col: 2, row: 3 },
            { id: "_spacer18", type: "spacer", row: 3 },
        ],
    },
    {
        id: "glu",
        label: "Klejenie opakowania",
        fields: [
            { id: "GlueR", label: "R", type: "number" },
            { id: "GlueA", label: "A", type: "number" },
            { id: "GlueG", label: "G", type: "number" },
            { id: "GlueYN", label: "tak/nie", type: "select", options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" },
                ] },
        ],
    },
    {
        id: "leaflet",
        label: "Ulotka",
        fields: [
            { id: "LeafletR",  label: "R",       type: "number", col: 1, row: 1 },
            { id: "LeafletA",  label: "A",       type: "number", col: 2, row: 1 },
            { id: "LeafletG",  label: "G",       type: "number", col: 3, row: 1 },
            { id: "LeafletCatA", label: "Kategoria wady A", type: "select",col: 1, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.5.2A Wady graficzne",                    			value: "6.5.2A Wady graficzne" },
                    { label: "6.5.3A Niewłaściwy materiał",            			    value: "6.5.3A Niewłaściwy materiał" },
                    { label: "6.5.5A Różnice kolorystyczne",                        value: "6.5.5A Różnice kolorystyczne" },
                    { label: "6.5.6A Niewłaściwe złożenie",                         value: "6.5.6A Niewłaściwe złożenie" },
                    { label: "6.5.7A Uszkodzenia",                                  value: "6.5.7A Uszkodzenia" },
                    { label: "6.5.8A Brak",                         				value: "6.5.8A Brak" },

                ] },
            { id: "LeafletDesA", label: "Opis wady A", type: "text",col: 1, row: 3 },
            { id: "LeafletCatB", label: "Kategoria wady A", type: "select",col: 2, row: 2,  options: [
                    { label: "---",                   value: "" },
                    { label: "6.5.2B Wady graficzne",                    			value: "6.5.2B Wady graficzne"},
                    { label: "6.5.5B Różnice kolorystyczne",            			value: "6.5.5B Różnice kolorystyczne" },
                    { label: "6.5.7B Uszkodzenia",                        			value: "6.5.7B Uszkodzenia" },

                ] },
            { id: "LeafletDesB", label: "Opis wady B", type: "text",col: 2, row: 3 },
            { id: "_spacer19", type: "spacer", row: 2 },
            { id: "LeafletYN", label: "tak/nie", type: "select",col: 3, row: 3, options: [
                    { label: "TAK", value: "TAK" },
                    { label: "NIE", value: "NIE" },
                ] },
        ],
    },
];