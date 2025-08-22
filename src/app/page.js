import {ChartComponent} from "@/app/components/ChartComponent";

export default async function Home({params, searchParams, ...props}) {
    const sp = await searchParams;
    const locale = typeof sp?.get === 'function' ? (sp.get('locale') ?? 'en') : (sp?.locale ?? 'en');
    const data_BASE64 = typeof sp?.get === 'function' ? (sp.get('data_BASE64') ?? '') : (sp?.data_BASE64 ?? '');

    let currency;
    let candle = [];
    let volume = [];
    if (data_BASE64 !== '') {
        const decodedData = JSON.parse(atob(data_BASE64));

        candle = decodedData?.candlestickData;
        volume = decodedData?.volumeData;
        currency = decodedData?.currency;
    }
    return (
        <ChartComponent {...props} initCandlestickData={candle} InitVolumeData={volume} locale={locale} currency={currency} />
    )
}
