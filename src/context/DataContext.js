import React, { useState, createContext } from "react";

export const DataContext = createContext();

export const DataProvider = props => {
    const [stockList, setStockList] = useState([{
        timestamp: "",
        symbol: "",
        name: "",
        industry: "",
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volumes: 0,
    }]);
    return (
        <DataContext.Provider value={[stockList, setStockList]}>
            {props.children}
        </DataContext.Provider>
    );
};