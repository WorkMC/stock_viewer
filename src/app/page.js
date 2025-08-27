import {ChartComponent} from "@/app/components/ChartComponent";

export default async function Home({params, searchParams, ...props}) {
    const sp = await searchParams;
    const locale = typeof sp?.get === 'function' ? (sp.get('locale') ?? 'en') : (sp?.locale ?? 'en');
    let data_BASE64 = typeof sp?.get === 'function' ? (sp.get('data_BASE64') ?? '') : (sp?.data_BASE64 ?? '');

    let decodedData;
    let currency;
    let candle = [];
    let volume = [];

    if (data_BASE64 === '__SS__') {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const ssData = window.sessionStorage.getItem('chartData');
            if (ssData) {
                decodedData = JSON.parse(ssData);
            }
        }
    } else if (data_BASE64 !== '') {
        decodedData = JSON.parse(atob(data_BASE64));
    }

    if (decodedData) {
        candle = decodedData?.candlestickData;
        volume = decodedData?.volumeData;
        currency = decodedData?.currency;
    }

    return (
        <ChartComponent {...props} initCandlestickData={candle} InitVolumeData={volume} locale={locale} currency={currency} />
    )
}
