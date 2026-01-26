import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { fetchFilterOptions } from '../api/sampleService'

export default function SampleFilters({ filters, setFilters }) {
    const [options, setOptions] = useState({ owners: [], statuses: [], types: [], creates:[] })
    const [loadingOptions, setLoadingOptions] = useState(false)
    console.log("SampleFilters props:", { filters, setFilters });

    useEffect(() => {
        let mounted = true
        setLoadingOptions(true)
        fetchFilterOptions()
            .then((opts) => {
                if (!mounted) return
                setOptions((prev) => ({
                    ...prev,
                    ...opts,
                }))
            })
            .catch((err) => console.error('filter options err', err))
            .finally(() => mounted && setLoadingOptions(false))

        return () => (mounted = false)
    }, [])

    const handleReset = () => setFilters({ search: '', status: '', owner: '', type: '',create:'' })

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Filtry</AccordionSummary>

            <AccordionDetails>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr 1fr' } }}>
                    <TextField
                        label="Szukaj"
                        size="small"
                        value={filters.search}
                        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    />
                    <TextField
                        select
                        label="Data utworzenia"
                        size="small"
                        value={filters.create}
                        onChange={(e) => setFilters((f) => ({ ...f, create: e.target.value }))}
                        disabled={loadingOptions}
                    >
                        <MenuItem value="">—</MenuItem>
                        {(options.creates??[]).map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Rodzaj badania"
                        size="small"
                        value={filters.status}
                        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                        disabled={loadingOptions}
                    >
                        <MenuItem value="">—</MenuItem>
                        {options.statuses.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Właściciel"
                        size="small"
                        value={filters.owner}
                        onChange={(e) => setFilters((f) => ({ ...f, owner: e.target.value }))}
                        disabled={loadingOptions}
                    >
                        <MenuItem value="">—</MenuItem>
                        {options.owners.map((o) => (
                            <MenuItem key={o} value={o}>{o}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Indeks"
                        size="small"
                        value={filters.type}
                        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                        disabled={loadingOptions}
                    >
                        <MenuItem value="">—</MenuItem>
                        {options.types.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" onClick={handleReset}>Resetuj filtry</Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}
