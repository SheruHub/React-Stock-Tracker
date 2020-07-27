import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-enterprise';
import userService from '../services/user.service';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
    },
    wrapper: {
        padding: '0 1rem',
    },
})

const Stocklist = () => {
    const classes = useStyles();
    let history = useHistory();

    useEffect(() => {
        fetchStocks();
    }, []);

    const [table, setTable] = useState({
        columnDefs: [
            { headerName: "Name", field: "name", sortable: true, filter: 'agTextColumnFilter' },
            { headerName: "Symbol", field: "symbol", sortable: true },
            {
                headerName: "Industry", field: "industry", sortable: true, filter: 'agSetColumnFilter', filterParams: {
                    valueGetter: params => {
                        return params.data.industry
                    }

                }, menuTabs: ['filterMenuTab'],
            },
        ],
        rowData: [{}],
        industryData: [{}],
        defaultColDef: {
            sortable: true,
            flex: 1,
            resizable: true,
        },
        animateRows: true,
        onRowClicked: handleSelection,
        pagination: true,
        paginationPageSize: 15,
        domLayout: 'autoHeight',
        rowSelection: 'single',
        getRowHeight: params => {
            return 40;
        },
        statusBar: {
            statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'agSelectedRowCountComponent' },
                { statusPanel: 'agAggregationComponent' },
            ]
        },
        sideBar: {
            toolPanels: [
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
        },
    });

    function handleSelection(event) {
        history.push(`/stocklist/${event.node.data.symbol}`)
    }

    async function fetchStocks() {
        const stockData = await userService.getAllStocks();
        setTable(prevState => {
            return { ...prevState, rowData: stockData }
        })
    }

    return (
        <div className={classes.wrapper}>
            <h1>Stock List</h1>
            <div id="table" className="ag-theme-balham-dark"
                style={{
                }} >

                <AgGridReact
                    columnDefs={table.columnDefs}
                    defaultColDef={table.defaultColDef}
                    onRowClicked={table.onRowClicked}
                    animateRows={table.animateRows}
                    rowData={table.rowData}
                    pagination={table.pagination}
                    paginationPageSize={table.paginationPageSize}
                    domLayout={table.domLayout}
                    rowSelection={table.rowSelection}
                    getRowHeight={table.getRowHeight}
                    statusBar={table.statusBar}
                    sideBar={table.sideBar}
                    floatingFilter={true}
                />
            </div>

        </div>
    );
}


export default Stocklist;