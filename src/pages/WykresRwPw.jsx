// src/pages/WykresRwPw.jsx
// Produkcja → Wykres RW/PW: dla jednego indeksu, per miesiąc — słupki typów RW
// (zużycie, straty, mini inwentury) i linia PW (przyjęcia z produkcji).
// Dane z widoku RW_ZUZYCIE_INDEKS, tabela nad wykresem jak w szablonie Node-RED.
// "Pobierz PDF" wysyła do backendu filtry + SVG wykresu zdjęty z recharts —
// tabela w PDF jest liczona ponownie na serwerze, wykres osadzany wektorowo.
import React, { useMemo, useRef, useState } from "react";
import {
    Alert, Autocomplete, Box, CircularProgress, Grid, Paper, Skeleton, Snackbar, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import {
    Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useWykresRw, useWykresRwItems } from "../hooks/queries.js";
import { fetchWykresRwPdf } from "../api/produkcjaService.js";
import { downloadBlob } from "../api/excelService.js";
import ReportFilterBar from "../components/produkcja/ReportFilterBar.jsx";
import { defaultRange, formatNumber } from "../config/produkcja.js";

// Kolor serii przychodzi z backendu (`RW_TYPES[].color` — jedno źródło dla
// ekranu i PDF); zapasowy odcień tylko na wypadek starszej odpowiedzi API.
const OTHER_COLOR = "#4a3aa7";
const seriesColor = (s) => s.color ?? OTHER_COLOR;

/**
 * Serializuje wykres recharts do samodzielnego SVG pod wydruk: bez stylu
 * z ResponsiveContainer (width/height 100%), z jawnym rozmiarem i bez
 * artefaktów najechania (kursor tooltipa, aktywna kropka linii).
 *
 * Wykres to SVG będące bezpośrednim dzieckiem `.recharts-wrapper` — ikony
 * legendy (recharts 3) to również `svg.recharts-surface`, a legenda siedzi
 * w DOM przed wykresem, więc samo `svg.recharts-surface` łapało pierwszą
 * ikonkę 14×14 i PDF wychodził bez wykresu.
 */
function chartSvgMarkup(container) {
    const svg = container?.querySelector(".recharts-wrapper > svg.recharts-surface");
    if (!svg) return null;
    const clone = svg.cloneNode(true);
    clone.removeAttribute("style");
    const { width, height } = svg.getBoundingClientRect();
    if (width && height) {
        clone.setAttribute("width", String(Math.round(width)));
        clone.setAttribute("height", String(Math.round(height)));
    }
    clone.querySelectorAll(".recharts-tooltip-cursor, .recharts-active-dot").forEach((el) => el.remove());
    const markup = new XMLSerializer().serializeToString(clone);
    // XMLSerializer sam dokłada deklarację przestrzeni nazw; dopisujemy ją tylko, gdyby jej zabrakło.
    return /^<svg[^>]*\sxmlns=/.test(markup)
        ? markup
        : markup.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
}

const HEAD_SX = { fontWeight: 700, backgroundColor: "#faf9ff", whiteSpace: "nowrap" };

const tooltipFormatter = (value) => formatNumber(value);

export default function WykresRwPw() {
    const [range, setRange] = useState(defaultRange);
    const [item, setItem] = useState("");
    const [submitted, setSubmitted] = useState(null);
    const [exportingPdf, setExportingPdf] = useState(false);
    const [snack, setSnack] = useState(null);
    const chartRef = useRef(null);

    const rangeValid = Boolean(range.dateFrom && range.dateTo);
    // Lista indeksów zależy od zakresu dat — pokazujemy tylko te z ruchem w okresie.
    const { data: items = [], isFetching: itemsLoading } = useWykresRwItems(range, rangeValid);
    // Wybór trzymamy jako kod; po zmianie dat indeks spoza nowej listy znika z pola.
    const selected = items.find((o) => o.Indeks === item) ?? null;
    const valid = rangeValid && Boolean(selected);
    const submit = () => { if (valid) setSubmitted({ ...range, item: selected.Indeks }); };

    const { data, isFetching, isError } = useWykresRw(submitted, Boolean(submitted));

    // recharts: jeden rekord na miesiąc, klucz = etykieta serii.
    const { months, series, chartData } = useMemo(() => {
        const months = data?.months ?? [];
        const series = data?.series ?? [];
        const chartData = months.map((m, i) => ({
            month: m,
            ...Object.fromEntries(series.map((s) => [s.label, s.values[i] ?? 0])),
        }));
        return { months, series, chartData };
    }, [data]);
    const hasData = series.some((s) => s.values.some((v) => v > 0));
    // PDF ma sens tylko dla wykresu, który jest na ekranie — drukujemy `submitted`,
    // nie bieżące (być może zmienione, ale niewysłane) filtry.
    const chartShown = Boolean(submitted) && !isFetching && !isError && hasData;

    const handlePdf = async () => {
        const svg = chartSvgMarkup(chartRef.current);
        if (!svg) { setSnack("Wykres nie jest jeszcze wyrenderowany."); return; }
        setExportingPdf(true);
        try {
            const blob = await fetchWykresRwPdf({ ...submitted, svg });
            downloadBlob(blob, `Wykres_RW_PW_${submitted.item}_${submitted.dateFrom}_${submitted.dateTo}.pdf`);
        } catch (err) {
            setSnack(err.message || "Nie udało się wygenerować pliku PDF.");
        } finally {
            setExportingPdf(false);
        }
    };

    const extra = (
        <Grid item xs={12} md={5}>
            <Autocomplete
                size="small"
                options={items}
                value={selected}
                onChange={(_e, opt) => setItem(opt?.Indeks ?? "")}
                getOptionLabel={(o) => (o.Nazwa ? `${o.Indeks} — ${o.Nazwa}` : o.Indeks)}
                isOptionEqualToValue={(o, v) => o.Indeks === v.Indeks}
                loading={itemsLoading}
                disabled={!rangeValid}
                noOptionsText={itemsLoading ? "Ładowanie…" : "Brak indeksów z ruchem RW/PW w tym okresie"}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Indeks"
                        placeholder="Wpisz fragment indeksu lub nazwy"
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.defaultPrevented) submit(); }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {itemsLoading ? <CircularProgress color="inherit" size={16} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </Grid>
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", px: 3, pt: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 1.5 }}>
                Produkcja: Wykres RW / PW
            </Typography>

            <ReportFilterBar
                subtitle="Zakres dat dokumentów i indeks"
                dateFrom={range.dateFrom}
                dateTo={range.dateTo}
                onDateFrom={(v) => setRange((r) => ({ ...r, dateFrom: v }))}
                onDateTo={(v) => setRange((r) => ({ ...r, dateTo: v }))}
                extra={extra}
                valid={valid}
                loading={isFetching}
                onShow={submit}
                exportingPdf={exportingPdf}
                onPdf={handlePdf}
                pdfDisabled={!chartShown}
            />

            <Box sx={{ flexGrow: 1, overflow: "auto", pb: 1 }}>
                {isFetching ? (
                    <Box>
                        <Skeleton variant="rounded" height={120} sx={{ mb: 1 }} />
                        <Skeleton variant="rounded" height={360} />
                    </Box>
                ) : isError ? (
                    <Alert severity="error">Nie udało się pobrać danych wykresu.</Alert>
                ) : !submitted ? (
                    <Alert severity="info">Podaj zakres dat oraz indeks i kliknij „Pokaż dane”.</Alert>
                ) : !hasData ? (
                    <Alert severity="info">
                        Brak dokumentów RW / PW dla indeksu „{submitted.item}” w wybranym okresie.
                    </Alert>
                ) : (
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                            {data.name || data.item}
                            <Typography component="span" sx={{ color: "text.secondary", ml: 1 }}>
                                ({data.item})
                            </Typography>
                        </Typography>

                        {/* Tabela — wartości do odczytu bez polegania na kolorze. */}
                        <TableContainer sx={{ mb: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={HEAD_SX}>Typ</TableCell>
                                        {months.map((m) => (
                                            <TableCell key={m} align="right" sx={HEAD_SX}>{m}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {series.map((s) => (
                                        <TableRow key={s.label} hover>
                                            <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                                                <Box component="span" sx={{
                                                    display: "inline-block", width: 10, height: 10, borderRadius: "2px",
                                                    bgcolor: seriesColor(s), mr: 1, verticalAlign: "middle",
                                                }} />
                                                {s.label}
                                            </TableCell>
                                            {s.values.map((v, i) => (
                                                <TableCell key={months[i]} align="right">{formatNumber(v)}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box ref={chartRef} sx={{ width: "100%", height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}
                                               barCategoryGap="25%" barGap={2}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede9fe" />
                                    <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                                    <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(v) => formatNumber(v, 0)} />
                                    <Tooltip formatter={tooltipFormatter} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
                                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10, fontSize: "0.8rem" }} />
                                    {series.map((s) =>
                                        s.mark === "line" ? (
                                            <Line key={s.label} type="monotone" dataKey={s.label} name={s.label}
                                                  stroke={seriesColor(s)} strokeWidth={2}
                                                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
                                        ) : (
                                            <Bar key={s.label} dataKey={s.label} name={s.label}
                                                 fill={seriesColor(s)} radius={[4, 4, 0, 0]} maxBarSize={48} />
                                        ),
                                    )}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                )}
            </Box>

            <Snackbar open={Boolean(snack)} autoHideDuration={6000} onClose={() => setSnack(null)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                {snack ? (
                    <Alert severity="error" variant="filled" onClose={() => setSnack(null)}>{snack}</Alert>
                ) : null}
            </Snackbar>
        </Box>
    );
}