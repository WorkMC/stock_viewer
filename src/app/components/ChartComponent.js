"use client";

import {useEffect, useRef} from "react";
import {CandlestickSeries, createChart, HistogramSeries} from "lightweight-charts";

function CurrencyFormatter(value, language, currency) {
    const _currencyFormatter = Intl.NumberFormat(language, { style: 'currency', currency: currency });
    return Intl.NumberFormat(language, {
        style: 'decimal',
        minimumFractionDigits: _currencyFormatter.resolvedOptions().minimumFractionDigits,
        maximumFractionDigits: _currencyFormatter.resolvedOptions().maximumFractionDigits,
    }).format(value);
}

function TimeFormatter(value, language) {
    return new Intl.DateTimeFormat(language, {
        timeZone: "UTC",
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(value);
}


export const ChartComponent = props => {
    const {
        initCandlestickData = [],
        InitVolumeData = [],
        locale,
        currency,
    } = props;

    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candleRef = useRef(null);
    const volumeRef = useRef(null);

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            localization: {
                locale: locale,
                timeFormatter: (timestamp) => {
                    const date = new Date(timestamp * 1000);
                    return TimeFormatter(date, locale);
                }
            },
            leftPriceScale: {
                visible: true
            },
            crosshair: {
                mode: 3,
            },
            layout: {
                attributionLogo: false,
            }
        });

        const candle = chart.addSeries(CandlestickSeries, {
            priceFormat: {
                type: 'custom',
                formatter: (price) => CurrencyFormatter(price, locale, currency),
                minMove: 0.01,
            }
        });

        candle.priceScale().applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: 0.25,
            },
        })

        const volume = chart.addSeries(HistogramSeries, {
            priceFormat: {
                type: 'volume'
            },
            priceScaleId: 'left',
        });

        volume.priceScale().applyOptions({
            scaleMargins: {
                top: 0.85,
                bottom: 0,
            },
        })

        chartRef.current = chart;
        candleRef.current = candle;
        volumeRef.current = volume;

        const resize = () => {
            chart.resize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            chart.remove()

            chartRef.current = null;
            candleRef.current = null;
            volumeRef.current = null;
        };
    }, []);

    useEffect(() => {
        const candle = candleRef.current;
        const volume = volumeRef.current;
        if (!candle || !volume) return;

        if (candle.data().length > 0 || volume.data().length > 0) return;

        candle.setData(
            initCandlestickData.map(d => ({
                time: d.time,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            }))
        );

        volume.setData(
            InitVolumeData.map(d => ({
                time: d.time,
                value: d.value,
                color: d.color || 'rgba(0,0,0,0.5)',
            }))
        );
    }, [initCandlestickData, InitVolumeData]);

    return (
        <div ref={chartContainerRef}
             style={{position: "absolute", width: "100%", height: "100%"}}/>
    );
}

