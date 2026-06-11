// src/pages/Probki.jsx
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import SampleTable from "../components/SampleTable";
import SampleEditModal from "../components/SampleEditModal";
import SampleFilters from "../components/SampleFilters";

export default function Probki() {
    const [filters, setFilters] = useState({
        search: "",
        owner: "",
        batch: "",
        createFrom: "",
        createTo: "",
    });
    const [editRow, setEditRow] = useState(null);

    const handleEdit   = (row) => setEditRow(row);
    const handleClose  = () => setEditRow(null);
    // Odświeżanie danych po zapisie robi react-query (unieważnienie w mutacji).
    const handleSaved  = () => setEditRow(null);

    return (
        <PageLayout
            title="Laboratorium: Próbki"
            filters={filters}
            setFilters={setFilters}
            FiltersComponent={SampleFilters}
        >
            <SampleTable
                onEdit={handleEdit}
                filters={filters}
            />
            <SampleEditModal
                row={editRow}
                open={Boolean(editRow)}
                onClose={handleClose}
                onSaved={handleSaved}
            />
        </PageLayout>
    );
}