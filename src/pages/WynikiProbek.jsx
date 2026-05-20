// src/pages/WynikiProbek.jsx
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import ResultTable from "../components/ResultTable";
import ResultFilters from "../components/ResultFilters";
import ResultEditModal from "../components/ResultEditModal";

export default function WynikiProbek() {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        batch: "",
        dateFrom: "",
        dateTo: "",
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
            title="Laboratorium: Wyniki Analiz"
            filters={filters}
            setFilters={setFilters}
            FiltersComponent={ResultFilters}
        >
            <ResultTable
                filters={filters}
                onEdit={handleEdit}
                reloadTrigger={reload}
            />
            <ResultEditModal
                open={Boolean(editRow)}
                row={editRow}
                onClose={handleClose}
                onSaved={handleSaved}
            />
        </PageLayout>
    );
}