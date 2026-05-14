// src/pages/Probki.jsx
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import SampleTable from "../components/SampleTable";
import SampleEditModal from "../components/SampleEditModal";
import SampleFilters from "../components/SampleFilters";

export default function Probki() {
    const [filters, setFilters] = useState({
        search: "",
        //status: "",
        owner: "",
        batch: "",
        create:""
    });
    const [editRow, setEditRow] = useState(null);
    const [reload, setReload] = useState(false);

    const handleEdit   = (row) => setEditRow(row);
    const handleClose  = () => setEditRow(null);
    const handleSaved  = () => {
        setReload(prev => !prev);
        setEditRow(null);
    };

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
                reloadTrigger={reload}
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