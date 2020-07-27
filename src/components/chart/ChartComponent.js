import React, { useContext, useEffect } from 'react';
import Chart from './Chart';
import { DataContext } from '../../context/DataContext';



const ChartComponent = () => {

    const [stockList, setStockList] = useContext(DataContext);

    const parseData =() => {
        const newData = stockList.slice(0).reverse().map(stock => {
            return {
            date: new Date(stock.timestamp),
            open: stock.open,
            high: stock.high,
            low: stock.low,
            close: stock.close,
            volume: stock.volumes,
            }
        })
        return newData;
    }    

	useEffect(() => {
	}, [stockList]);

    if (stockList.length <= 1) {
        return (
            <div>Loading...</div>
        );
    } else {
        return (
        <Chart data={parseData()} />
        );
    }
}

export default ChartComponent;