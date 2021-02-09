/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22829039607430773, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4440789473684211, 500, 1500, "Checkout Process  My Account > Home"], "isController": false}, {"data": [0.27, 500, 1500, "Account Creation, Login, Account Registration"], "isController": false}, {"data": [0.2138157894736842, 500, 1500, "Checkout Process Login > My Account"], "isController": false}, {"data": [0.2138157894736842, 500, 1500, "Checkout Process Place Order > Logout"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "Checkout Process  Checkout Begin > Shipping Step"], "isController": false}, {"data": [0.0, 500, 1500, "Home - PDP"], "isController": true}, {"data": [0.7796052631578947, 500, 1500, "Checkout Process  Shipping Step > Billing Step"], "isController": false}, {"data": [0.75, 500, 1500, "Checkout Process  Billing Step > Place Order"], "isController": false}, {"data": [0.655, 500, 1500, "Account Creation, Login, Logout > Account SubmitRegistration"], "isController": false}, {"data": [0.0, 500, 1500, "Home - PLP"], "isController": true}, {"data": [0.06708333333333333, 500, 1500, "Account Creation, Login, Logout > Logout"], "isController": false}, {"data": [0.3848684210526316, 500, 1500, "Checkout Process  PDP > Cart"], "isController": false}, {"data": [0.46381578947368424, 500, 1500, "Checkout Process  Home > PDP"], "isController": false}, {"data": [0.3125, 500, 1500, "PLP"], "isController": false}, {"data": [0.4686111111111111, 500, 1500, "Search"], "isController": false}, {"data": [0.5657894736842105, 500, 1500, "Checkout Process  PDP > Add to Cart"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.0, 500, 1500, "Account Creation, Login, Logout"], "isController": true}, {"data": [0.0, 500, 1500, "Checkout Process  Cart > Checkout Begin"], "isController": false}, {"data": [0.24675925925925926, 500, 1500, "Home"], "isController": false}, {"data": [0.30277777777777776, 500, 1500, "PDP"], "isController": false}, {"data": [0.0, 500, 1500, "Home - Search"], "isController": true}, {"data": [0.4506578947368421, 500, 1500, "Checkout Process Login"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16072, 0, 0.0, 1409.5409407665513, 222, 6514, 1912.0, 2023.0, 2560.2700000000004, 1.1164186689485915, 310.8638640459146, 0.44358411532538167], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Checkout Process  My Account > Home", 152, 0, 0.0, 1359.506578947368, 897, 1791, 1524.9, 1603.45, 1786.23, 0.010624351923269812, 3.429609987991687, 0.008300274940054541], "isController": false}, {"data": ["Account Creation, Login, Account Registration", 1200, 0, 0.0, 1516.9325, 1034, 2650, 1788.9, 1838.95, 2000.7000000000003, 0.0833895749688957, 18.936852733485075, 0.0200330424241683], "isController": false}, {"data": ["Checkout Process Login > My Account", 152, 0, 0.0, 1522.1118421052633, 1006, 2199, 1764.0, 1894.9999999999998, 2142.29, 0.010623876673566362, 2.416708337279428, 0.01719117543759713], "isController": false}, {"data": ["Checkout Process Place Order > Logout", 152, 0, 0.0, 1569.546052631578, 1079, 2337, 1889.3000000000002, 1968.3999999999996, 2323.22, 0.010624092015820112, 3.454101399706649, 0.02506676315718659], "isController": false}, {"data": ["Checkout Process  Checkout Begin > Shipping Step", 152, 0, 0.0, 618.8749999999999, 230, 1833, 749.1, 796.5999999999997, 1754.56, 0.010624324446738304, 1.6295522461682885, 0.022057923607193004], "isController": false}, {"data": ["Home - PDP", 1800, 0, 0.0, 3048.4450000000033, 1926, 7764, 3760.9, 3854.95, 4131.77, 0.1250344452530777, 76.59179611592045, 0.0], "isController": true}, {"data": ["Checkout Process  Shipping Step > Billing Step", 152, 0, 0.0, 499.4671052631578, 222, 1376, 651.1, 742.4, 1109.4099999999994, 0.01062433335803025, 0.6687877508950302, 0.020875154996442245], "isController": false}, {"data": ["Checkout Process  Billing Step > Place Order", 152, 0, 0.0, 656.5, 235, 1682, 1181.5, 1207.9499999999998, 1463.1099999999994, 0.010624455889810413, 0.011929031605309852, 0.013135313629394515], "isController": false}, {"data": ["Account Creation, Login, Logout > Account SubmitRegistration", 1200, 0, 0.0, 617.1549999999999, 287, 3152, 900.0, 920.0, 1015.8800000000001, 0.08339323168022698, 1.8880514045174948, 0.11344411301812128], "isController": false}, {"data": ["Home - PLP", 1800, 0, 0.0, 3017.4855555555555, 1881, 5857, 3754.9, 3852.0, 4076.96, 0.12504458186689615, 84.92924997367551, 0.0], "isController": true}, {"data": ["Account Creation, Login, Logout > Logout", 1200, 0, 0.0, 1965.835833333332, 1028, 5435, 2582.9, 2661.9, 2821.86, 0.08338346764325384, 27.139081180068196, 0.15728206584208754], "isController": false}, {"data": ["Checkout Process  PDP > Cart", 152, 0, 0.0, 1411.7828947368419, 1000, 1994, 1583.4, 1659.7999999999997, 1856.1999999999998, 0.010623645004751636, 3.0373501918625045, 0.012076096470245021], "isController": false}, {"data": ["Checkout Process  Home > PDP", 152, 0, 0.0, 1293.157894736842, 930, 1743, 1488.5000000000002, 1554.8, 1724.45, 0.010624017016320307, 3.0731515916262757, 0.008476388576497745], "isController": false}, {"data": ["PLP", 1800, 0, 0.0, 1420.2161111111102, 749, 4728, 1842.0, 1896.8999999999996, 2054.99, 0.12506177530609391, 44.4978543128413, 0.0], "isController": false}, {"data": ["Search", 1800, 0, 0.0, 1239.7577777777788, 843, 2148, 1443.9, 1524.7999999999993, 1783.98, 0.12505261762570793, 39.196334049622855, 0.0], "isController": false}, {"data": ["Checkout Process  PDP > Add to Cart", 152, 0, 0.0, 661.6578947368421, 261, 1372, 762.2, 791.0, 1362.99, 0.010624694277917117, 0.0812728223413415, 0.009972118740185264], "isController": false}, {"data": ["Transaction Controller", 152, 0, 0.0, 12899.513157894742, 10916, 14683, 13943.1, 14100.05, 14639.539999999999, 0.010615589663879701, 21.89619383161433, 0.15376181839882827], "isController": true}, {"data": ["Account Creation, Login, Logout", 1200, 0, 0.0, 4099.923333333338, 2502, 10316, 4939.700000000001, 5216.75, 5496.9, 0.08337287755233906, 47.95628590407377, 0.29070754566228285], "isController": true}, {"data": ["Checkout Process  Cart > Checkout Begin", 152, 0, 0.0, 1955.1118421052618, 1551, 2632, 2120.0, 2217.7, 2486.2499999999995, 0.010623538084091035, 1.6985167111006048, 0.01212784767607658], "isController": false}, {"data": ["Home", 5400, 0, 0.0, 1551.7607407407402, 940, 3488, 1938.9000000000005, 1999.9499999999998, 2185.9699999999993, 0.37514922602546347, 121.31764589132224, 0.0], "isController": false}, {"data": ["PDP", 1800, 0, 0.0, 1447.8038888888889, 934, 6514, 1857.0, 1912.9499999999998, 2048.0, 0.1250517227820062, 36.16217339887682, 0.0], "isController": false}, {"data": ["Home - Search", 1800, 0, 0.0, 2697.1294444444425, 1885, 4540, 3010.9, 3130.95, 3433.99, 0.12503976959338456, 79.62798026918023, 0.0], "isController": true}, {"data": ["Checkout Process Login", 152, 0, 0.0, 1351.7960526315787, 1001, 1750, 1500.3000000000002, 1581.5, 1748.41, 0.010623982858483236, 2.412579017729086, 0.004606492567545466], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16072, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
