// src/config/sampleEditFields.js

export const sampleEditFields = [
    { id: "sampleNumber", label: "Nr. próbki",         type: "text" },
    { id: "comment",      label: "Komentarz",           type: "text" },
    { id: "person",       label: "Osoba rejestrująca",  type: "select", dictType: "PERSON" },
    { id: "MM/RW",        label: "MM/RW",               type: "text" },
    { id: "sampleDateTake", label: "Data pobrania",     type: "Date" },
    { id: "numberLims",   label: "Nr. serii Lims",      type: "text" },
    { id: "sendDate",     label: "Data wysyłki",        type: "Date" },
    { id: "numberOrder",  label: "Nr. zlecenia",        type: "text" },
];
