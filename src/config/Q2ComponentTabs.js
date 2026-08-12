// src/config/Q2ComponentTabs.js
//
// Deskryptory 12 komponentów opakowań Q2 — po normalizacji żyją w tabeli
// _ESL_Q2_Component (model instancji). Każdy komponent renderowany jest w
// Q2Modal jako lista instancji (przycisk "+"), a pola instancji mapują się na
// kolumny child: CountR/A/G, CategoryA/B, DescriptionA/B, Flag.
//
// `key`      — wartość kolumny "Component" (musi pasować do backend config/q2.ts),
// `label`    — etykieta zakładki,
// `defects`  — czy komponent ma wady A/B (Kategoria + Opis),
// `catDictA/B` — słowniki kategorii wad (jak w starych zakładkach),
// `flag`     — opcjonalne pole tak/nie (Glue/Leaflet) → kolumna Flag.
// `selects`  — dodatkowe listy rozwijane komponentu (np. Rodzaj zabezpieczenia
//              klejenia → kolumna ProtectType). Każdy wpis: { id, label, dict }.

export const Q2_COMPONENT_TABS = [
    { key: "Dropp",      label: "Kroplomierz",             defects: true,  catDictA: "DEFECT_DROPP_A",   catDictB: "DEFECT_DROPP_B" },
    { key: "Bottle",     label: "Butelka",                 defects: true,  catDictA: "DEFECT_BOTTLE_A",  catDictB: "DEFECT_BOTTLE_B" },
    { key: "Cap",        label: "Nakrętka",                defects: true,  catDictA: "DEFECT_CAP_A",     catDictB: "DEFECT_CAP_B" },
    { key: "Label",      label: "Etykieta",                defects: true,  catDictA: "DEFECT_LABEL_A",   catDictB: "DEFECT_LABEL_B" },
    { key: "Sniff",      label: "Zapach",                  defects: false },
    { key: "Contam",     label: "Płyn",                    defects: true,  catDictA: "DEFECT_CONTAM_A",  catDictB: "DEFECT_CONTAM_B" },
    { key: "MasterCase", label: "MasterCase",              defects: true,  catDictA: "DEFECT_MCASE_A",   catDictB: "DEFECT_MCASE_B" },
    { key: "Ctn",        label: "Opakowanie jednostkowe",  defects: true,  catDictA: "DEFECT_CTN_A",     catDictB: "DEFECT_CTN_B" },
    { key: "Srp",        label: "Opakowanie zbiorcze",     defects: true,  catDictA: "DEFECT_SRP_A",     catDictB: "DEFECT_SRP_B" },
    { key: "TaxStamp",   label: "Banderola",               defects: true,  catDictA: "DEFECT_STAMP_A",   catDictB: "DEFECT_STAMP_B" },
    { key: "Glue",       label: "Klejenie opakowania",     defects: false, flag: { label: "tak/nie", dict: "TAK_NIE" }, selects: [{ id: "ProtectType", label: "Rodzaj zabezpieczenia", dict: "PROTECT_TYPE" }] },
    { key: "Leaflet",    label: "Ulotka",                  defects: true,  catDictA: "DEFECT_LEAFLET_A", catDictB: "DEFECT_LEAFLET_B", flag: { label: "tak/nie", dict: "TAK_NIE" } },
];

/** Pola jednej instancji komponentu (mapowane na kolumny _ESL_Q2_Component). */
export function componentInstanceFields(comp) {
    const fields = [
        { id: "CountR", label: "R", type: "number" },
        { id: "CountA", label: "A", type: "number" },
        { id: "CountG", label: "G", type: "number" },
    ];
    if (comp.defects) {
        fields.push(
            { id: "CategoryA",    label: "Kategoria wady A", type: "select", dictType: comp.catDictA },
            { id: "DescriptionA", label: "Opis wady A",      type: "text" },
            { id: "CategoryB",    label: "Kategoria wady B", type: "select", dictType: comp.catDictB },
            { id: "DescriptionB", label: "Opis wady B",      type: "text" },
        );
    }
    if (comp.flag) {
        fields.push({ id: "Flag", label: comp.flag.label, type: "select", dictType: comp.flag.dict });
    }
    if (comp.selects) {
        for (const s of comp.selects) {
            fields.push({ id: s.id, label: s.label, type: "select", dictType: s.dict });
        }
    }
    return fields;
}

/** Pusta instancja komponentu (wszystkie pola child puste). */
export function emptyComponentInstance(key) {
    return {
        Component: key,
        CountR: "", CountA: "", CountG: "",
        CategoryA: "", CategoryB: "",
        DescriptionA: "", DescriptionB: "",
        Flag: "",
        ProtectType: "",
    };
}
