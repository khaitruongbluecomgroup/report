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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.19958399366085577, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3888888888888889, 500, 1500, "Checkout Process  My Account > Home"], "isController": false}, {"data": [0.2225, 500, 1500, "Account Creation, Login, Account Registration"], "isController": false}, {"data": [0.19444444444444445, 500, 1500, "Checkout Process Login > My Account"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "Checkout Process Place Order > Logout"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Checkout Process  Checkout Begin > Shipping Step"], "isController": false}, {"data": [0.0, 500, 1500, "Home - PDP"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "Checkout Process  Shipping Step > Billing Step"], "isController": false}, {"data": [0.5, 500, 1500, "Checkout Process  Billing Step > Place Order"], "isController": false}, {"data": [0.5525, 500, 1500, "Account Creation, Login, Logout > Account SubmitRegistration"], "isController": false}, {"data": [0.0, 500, 1500, "Home - PLP"], "isController": true}, {"data": [0.03, 500, 1500, "Account Creation, Login, Logout > Logout"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Checkout Process  PDP > Cart"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "Checkout Process  Home > PDP"], "isController": false}, {"data": [0.3080357142857143, 500, 1500, "PLP"], "isController": false}, {"data": [0.4330357142857143, 500, 1500, "Search"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "Checkout Process  PDP > Add to Cart"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.0, 500, 1500, "Account Creation, Login, Logout"], "isController": true}, {"data": [0.0, 500, 1500, "Checkout Process  Cart > Checkout Begin"], "isController": false}, {"data": [0.22879464285714285, 500, 1500, "Home"], "isController": false}, {"data": [0.28683035714285715, 500, 1500, "PDP"], "isController": false}, {"data": [0.0, 500, 1500, "Home - Search"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "Checkout Process Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3486, 0, 0.0, 1536.0286861732654, 219, 35910, 1959.3000000000002, 2109.2999999999993, 2954.040000000001, 0.48495599991152266, 141.3247742336624, 0.1332584819739935], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Checkout Process  My Account > Home", 18, 0, 0.0, 1373.6666666666667, 933, 2002, 1750.9000000000003, 2002.0, 2002.0, 0.0026357827125162046, 0.8509122270079575, 0.0020592052441532845], "isController": false}, {"data": ["Account Creation, Login, Account Registration", 200, 0, 0.0, 1582.6350000000004, 1079, 6373, 1888.6, 1990.1999999999998, 2760.560000000004, 0.02790737653358011, 6.336626976810296, 0.006704311159434284], "isController": false}, {"data": ["Checkout Process Login > My Account", 18, 0, 0.0, 1611.3333333333333, 1264, 3281, 1957.1000000000022, 3281.0, 3281.0, 0.0026350665581214433, 0.5996470513623514, 0.004263970006647687], "isController": false}, {"data": ["Checkout Process Place Order > Logout", 18, 0, 0.0, 1547.9444444444443, 1157, 1867, 1836.4, 1867.0, 1867.0, 0.002637987250900726, 0.857597318326581, 0.006226577329518608], "isController": false}, {"data": ["Checkout Process  Checkout Begin > Shipping Step", 18, 0, 0.0, 720.0555555555554, 281, 2827, 1011.7000000000029, 2827.0, 2827.0, 0.0026364355391510674, 0.40473061670621324, 0.005473693316635908], "isController": false}, {"data": ["Home - PDP", 448, 0, 0.0, 3195.5111607142867, 2178, 9980, 3812.0, 3901.8499999999995, 4609.969999999992, 0.06233719972393526, 38.18628983062683, 0.0], "isController": true}, {"data": ["Checkout Process  Shipping Step > Billing Step", 18, 0, 0.0, 510.88888888888886, 219, 1794, 794.1000000000016, 1794.0, 1794.0, 0.00263732206317705, 0.16638680604547476, 0.005138142105506069], "isController": false}, {"data": ["Checkout Process  Billing Step > Place Order", 18, 0, 0.0, 1090.1666666666667, 245, 2511, 1492.2000000000016, 2511.0, 2511.0, 0.0026376424400185454, 0.0029617667958476476, 0.0032609915322885535], "isController": false}, {"data": ["Account Creation, Login, Logout > Account SubmitRegistration", 200, 0, 0.0, 830.185, 298, 8101, 993.7, 1594.6999999999966, 7221.950000000038, 0.02791295401117523, 0.6319530950371884, 0.03797143060309287], "isController": false}, {"data": ["Home - PLP", 448, 0, 0.0, 3251.2455357142876, 2094, 45594, 3816.0, 3904.2999999999997, 5918.089999999998, 0.062323671309409204, 42.334623436082765, 0.0], "isController": true}, {"data": ["Account Creation, Login, Logout > Logout", 200, 0, 0.0, 2137.2949999999983, 1115, 5061, 2762.0, 2843.5499999999997, 3963.620000000004, 0.027908965420233665, 9.082637016274834, 0.052656368351456484], "isController": false}, {"data": ["Checkout Process  PDP > Cart", 18, 0, 0.0, 1469.7222222222222, 1190, 1993, 1766.2000000000003, 1993.0, 1993.0, 0.0026359533196097795, 0.7571665793171534, 0.0029963375625251787], "isController": false}, {"data": ["Checkout Process  Home > PDP", 18, 0, 0.0, 1334.7222222222222, 1003, 1683, 1639.8000000000002, 1683.0, 1683.0, 0.0026360347710559866, 0.7635738365878844, 0.0021031644608913488], "isController": false}, {"data": ["PLP", 448, 0, 0.0, 1484.5379464285704, 783, 25341, 1811.0, 1875.2999999999997, 2058.3999999999996, 0.06234473829195735, 22.187485768474048, 0.0], "isController": false}, {"data": ["Search", 448, 0, 0.0, 1339.1428571428582, 849, 10366, 1547.3000000000002, 1711.7499999999998, 3224.2699999999923, 0.06235299897743866, 19.49460508139189, 0.0], "isController": false}, {"data": ["Checkout Process  PDP > Add to Cart", 18, 0, 0.0, 635.5000000000001, 345, 786, 768.9, 786.0, 786.0, 0.0026363386177764504, 0.02076302601180113, 0.0024742850341208126], "isController": false}, {"data": ["Transaction Controller", 18, 0, 0.0, 13916.277777777776, 11645, 26508, 15355.200000000017, 26508.0, 26508.0, 0.002628476653213247, 5.42741597823395, 0.03803091418016426], "isController": true}, {"data": ["Account Creation, Login, Logout", 200, 0, 0.0, 4550.114999999999, 2756, 18698, 5413.6, 5970.299999999997, 11639.780000000033, 0.02789863310647095, 16.045545057992538, 0.09729103400703883], "isController": true}, {"data": ["Checkout Process  Cart > Checkout Begin", 18, 0, 0.0, 1992.2777777777776, 1790, 2250, 2183.4, 2250.0, 2250.0, 0.002635856047700794, 0.42140491154799287, 0.003009097382580301], "isController": false}, {"data": ["Home", 1344, 0, 0.0, 1686.7455357142828, 1035, 35910, 1982.0, 2079.5, 2953.949999999999, 0.1870251054764541, 60.48096308771144, 0.0], "isController": false}, {"data": ["PDP", 448, 0, 0.0, 1477.8683035714284, 953, 3393, 1827.1, 1894.2499999999993, 2079.6099999999997, 0.06235774639104543, 18.03312142726129, 0.0], "isController": false}, {"data": ["Home - Search", 448, 0, 0.0, 2915.029017857143, 2092, 37619, 3083.5, 3388.5999999999995, 6459.819999999996, 0.062334528263977826, 39.64644147218259, 0.0], "isController": true}, {"data": ["Checkout Process Login", 18, 0, 0.0, 1630.0, 1070, 6200, 2024.0000000000066, 6200.0, 6200.0, 0.0026333040695227386, 0.5976864478487295, 0.0011417841863946248], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3486, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
