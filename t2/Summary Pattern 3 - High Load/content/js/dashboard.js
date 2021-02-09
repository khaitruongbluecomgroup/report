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

    var data = {"OkPercent": 99.02365852900844, "KoPercent": 0.9763414709915635};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.33286005418077197, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4185261578848678, 500, 1500, "Checkout Process  My Account > Home"], "isController": false}, {"data": [0.40175, 500, 1500, "Account Creation, Login, Account Registration"], "isController": false}, {"data": [0.4011188199262454, 500, 1500, "Checkout Process Login > My Account"], "isController": false}, {"data": [0.3980185023127891, 500, 1500, "Checkout Process Place Order > Logout"], "isController": false}, {"data": [0.8140705088136017, 500, 1500, "Checkout Process  Checkout Begin > Shipping Step"], "isController": false}, {"data": [0.0, 500, 1500, "Home - PDP"], "isController": true}, {"data": [0.9286473309163645, 500, 1500, "Checkout Process  Shipping Step > Billing Step"], "isController": false}, {"data": [0.9472746593324165, 500, 1500, "Checkout Process  Billing Step > Place Order"], "isController": false}, {"data": [0.805625, 500, 1500, "Account Creation, Login, Logout > Account SubmitRegistration"], "isController": false}, {"data": [3.90625E-5, 500, 1500, "Home - PLP"], "isController": true}, {"data": [0.3001875, 500, 1500, "Account Creation, Login, Logout > Logout"], "isController": false}, {"data": [0.40583197899737466, 500, 1500, "Checkout Process  PDP > Cart"], "isController": false}, {"data": [0.44371523220201264, 500, 1500, "Checkout Process  Home > PDP"], "isController": false}, {"data": [0.47513802083333334, 500, 1500, "PLP"], "isController": false}, {"data": [0.466828125, 500, 1500, "Search"], "isController": false}, {"data": [0.847646727920495, 500, 1500, "Checkout Process  PDP > Add to Cart"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.0, 500, 1500, "Account Creation, Login, Logout"], "isController": true}, {"data": [0.3131016377047131, 500, 1500, "Checkout Process  Cart > Checkout Begin"], "isController": false}, {"data": [0.4623125, 500, 1500, "Home"], "isController": false}, {"data": [0.46459635416666667, 500, 1500, "PDP"], "isController": false}, {"data": [0.0, 500, 1500, "Home - Search"], "isController": true}, {"data": [0.415, 500, 1500, "Checkout Process Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351986, 13200, 0.9763414709915635, 1218.048141770639, 0, 15177915, 1476.0, 1649.0, 2063.0, 32.29416621105225, 9651.554736814913, 6.137299734795446], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Checkout Process  My Account > Home", 15999, 229, 1.4313394587161699, 1306.7573598349913, 0, 129163, 1616.0, 1992.0, 2621.0, 0.5434034643864395, 172.9237545006384, 0.420119555671887], "isController": false}, {"data": ["Account Creation, Login, Account Registration", 8000, 73, 0.9125, 1388.705000000001, 264, 100869, 1719.9000000000005, 1923.0, 2485.9199999999983, 0.27725077988045155, 62.389798805401334, 0.06660516782284286], "isController": false}, {"data": ["Checkout Process Login > My Account", 15999, 225, 1.4063378961185073, 1439.2467029189347, 0, 371016, 1638.0, 1806.0, 2667.0, 0.5434070819063477, 121.89405968221571, 0.8685245026932769], "isController": false}, {"data": ["Checkout Process Place Order > Logout", 15998, 242, 1.512689086135767, 1360.951056382039, 0, 129868, 1636.0, 1795.0, 2338.0200000000004, 0.5434207921056088, 174.0167730092768, 1.2651987020903221], "isController": false}, {"data": ["Checkout Process  Checkout Begin > Shipping Step", 15998, 242, 1.512689086135767, 505.83222902862764, 0, 100183, 768.0, 964.0499999999993, 1635.0, 0.5434185770415739, 81.85410066401569, 1.117728510836255], "isController": false}, {"data": ["Home - PDP", 192000, 1800, 0.9375, 2437.332156249986, 246, 175562, 2566.0, 2807.0, 3352.980000000003, 6.606642793517053, 4010.642832541569, 0.0], "isController": true}, {"data": ["Checkout Process  Shipping Step > Billing Step", 15998, 241, 1.5064383047880985, 332.06207025878314, 0, 63779, 519.1000000000004, 662.0, 983.0200000000004, 0.5434231917786913, 33.68924905396665, 1.0575309020138826], "isController": false}, {"data": ["Checkout Process  Billing Step > Place Order", 15998, 242, 1.512689086135767, 329.63020377546883, 0, 126990, 479.0, 550.0499999999993, 1049.1600000000035, 0.5434225272517158, 0.6105907701214012, 0.6642164672922853], "isController": false}, {"data": ["Account Creation, Login, Logout > Account SubmitRegistration", 8000, 79, 0.9875, 561.7815, 124, 95392, 884.0, 1211.8499999999995, 1993.4699999999884, 0.27726099409156824, 6.217341416675446, 0.3755022268823249], "isController": false}, {"data": ["Home - PLP", 192000, 1791, 0.9328125, 2334.5309062499887, 246, 143628, 2434.0, 2628.9500000000007, 3133.0, 6.595073027037532, 4439.567239608162, 0.0], "isController": true}, {"data": ["Account Creation, Login, Logout > Logout", 8000, 81, 1.0125, 1551.2317500000056, 124, 71656, 2073.0, 2429.95, 3177.7899999999954, 0.27725193290517086, 89.32407848042236, 0.5185883011493514], "isController": false}, {"data": ["Checkout Process  PDP > Cart", 15998, 237, 1.4814351793974248, 1333.7827228403535, 0, 130334, 1606.0, 1741.0499999999993, 2189.130000000003, 0.5433699609339483, 152.92472371362902, 0.6104071907514886], "isController": false}, {"data": ["Checkout Process  Home > PDP", 15999, 234, 1.4625914119632477, 1258.1294455903485, 0, 257810, 1496.0, 1641.0, 2222.0, 0.543404922462649, 154.9073408914743, 0.4290997634134558], "isController": false}, {"data": ["PLP", 192000, 1791, 0.9328125, 1118.6771770833068, 122, 100040, 1257.0, 1355.0, 1776.9900000000016, 6.595433692704317, 2325.4870732210147, 0.0], "isController": false}, {"data": ["Search", 192000, 1768, 0.9208333333333333, 1158.3802291666407, 110, 100281, 1318.0, 1421.0, 1685.9700000000048, 6.535688296141296, 2029.7231333632237, 0.0], "isController": false}, {"data": ["Checkout Process  PDP > Add to Cart", 15999, 236, 1.4750921932620789, 1464.4187761735088, 0, 15172544, 703.0, 896.0, 1631.0, 0.3822044517895991, 2.8698957100422975, 0.3553183600382539], "isController": false}, {"data": ["Transaction Controller", 16000, 246, 1.5375, 13036.218062499953, 0, 15177915, 12219.0, 12892.949999999999, 25201.909999999996, 0.3821847995359512, 776.7034270338544, 5.475095718593594], "isController": true}, {"data": ["Account Creation, Login, Logout", 8000, 83, 1.0375, 3501.718249999992, 514, 204662, 4307.900000000001, 4749.849999999999, 6215.949999999999, 0.2772340140629726, 157.92106785184885, 0.9606216118754645], "isController": true}, {"data": ["Checkout Process  Cart > Checkout Begin", 15998, 238, 1.4876859607450932, 1349.120515064377, 0, 131053, 1904.1000000000004, 2066.0, 2796.0300000000007, 0.543383544513482, 85.77928649495739, 0.6130632515254598], "isController": false}, {"data": ["Home", 576000, 5025, 0.8723958333333334, 1242.3456649305729, 113, 100640, 1344.0, 1460.9500000000007, 1789.9800000000032, 19.60696077062436, 6285.649725054872, 0.0], "isController": false}, {"data": ["PDP", 192000, 1800, 0.9375, 1182.5744479166788, 123, 100291, 1326.0, 1444.0, 1866.9800000000032, 6.607022232285695, 1892.7968565924962, 0.0], "isController": false}, {"data": ["Home - Search", 192000, 1768, 0.9208333333333333, 2414.805786458315, 227, 138353, 2533.9000000000015, 2691.0, 3102.9900000000016, 6.535431569946818, 4124.865938921701, 0.0], "isController": true}, {"data": ["Checkout Process Login", 16000, 215, 1.34375, 2357.279250000001, 0, 15172480, 1646.0, 2022.0, 3026.9699999999993, 0.3821848451813382, 85.6327715944649, 0.16492582365432298], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/HTTP\/1.1 401", 521, 3.946969696969697, 0.0385359019989852], "isController": false}, {"data": ["502/Bad Gateway", 1, 0.007575757575757576, 7.396526295390633E-5], "isController": false}, {"data": ["521/Origin Down", 4082, 30.924242424242426, 0.30192620337784565], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 735, 5.568181818181818, 0.05436446827112115], "isController": false}, {"data": ["503/HTTP\/1.1 503", 3, 0.022727272727272728, 2.2189578886171898E-4], "isController": false}, {"data": ["524/Origin Time-out", 343, 2.5984848484848486, 0.02537008519318987], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, 0.015151515151515152, 1.4793052590781266E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (production-ap01-unilever.demandware.net)", 11, 0.08333333333333333, 8.136178924929696E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 88, 0.6666666666666666, 0.006508943139943757], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException", 2, 0.015151515151515152, 1.4793052590781266E-4], "isController": false}, {"data": ["401", 239, 1.8106060606060606, 0.017677697845983612], "isController": false}, {"data": ["500", 744, 5.636363636363637, 0.05503015563770631], "isController": false}, {"data": ["500/HTTP\/1.1 500", 6427, 48.68939393939394, 0.47537474500475596], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, 0.015151515151515152, 1.4793052590781266E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351986, 13200, "500/HTTP\/1.1 500", 6427, "521/Origin Down", 4082, "500", 744, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 735, "401/HTTP\/1.1 401", 521], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Checkout Process  My Account > Home", 15999, 229, "521/Origin Down", 78, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 67, "500", 59, "401", 16, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["Account Creation, Login, Account Registration", 8000, 73, "521/Origin Down", 39, "500", 28, "524/Origin Time-out", 6, null, null, null, null], "isController": false}, {"data": ["Checkout Process Login > My Account", 15999, 225, "521/Origin Down", 77, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 67, "500", 58, "401", 14, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["Checkout Process Place Order > Logout", 15998, 242, "521/Origin Down", 76, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 70, "500", 63, "401", 25, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["Checkout Process  Checkout Begin > Shipping Step", 15998, 242, "521/Origin Down", 76, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 69, "500", 64, "401", 24, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": [], "isController": false}, {"data": ["Checkout Process  Shipping Step > Billing Step", 15998, 241, "521/Origin Down", 77, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 69, "500", 63, "401", 24, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["Checkout Process  Billing Step > Place Order", 15998, 242, "521/Origin Down", 78, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 70, "500", 62, "401", 24, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["Account Creation, Login, Logout > Account SubmitRegistration", 8000, 79, "521/Origin Down", 40, "500", 29, "401", 10, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Account Creation, Login, Logout > Logout", 8000, 81, "521/Origin Down", 41, "500", 26, "401", 14, null, null, null, null], "isController": false}, {"data": ["Checkout Process  PDP > Cart", 15998, 237, "521/Origin Down", 78, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 67, "500", 61, "401", 23, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["Checkout Process  Home > PDP", 15999, 234, "521/Origin Down", 80, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 67, "500", 58, "401", 20, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["PLP", 192000, 1791, "500/HTTP\/1.1 500", 1090, "521/Origin Down", 522, "401/HTTP\/1.1 401", 176, "524/Origin Time-out", 2, "503/HTTP\/1.1 503", 1], "isController": false}, {"data": ["Search", 192000, 1768, "500/HTTP\/1.1 500", 1352, "521/Origin Down", 238, "401/HTTP\/1.1 401", 174, "524/Origin Time-out", 4, null, null], "isController": false}, {"data": ["Checkout Process  PDP > Add to Cart", 15999, 236, "521/Origin Down", 78, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 67, "500", 61, "401", 21, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["Transaction Controller", 2, 2, "Non HTTP response code: javax.net.ssl.SSLException", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Checkout Process  Cart > Checkout Begin", 15998, 238, "521/Origin Down", 80, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 67, "500", 59, "401", 24, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}, {"data": ["Home", 576000, 5025, "500/HTTP\/1.1 500", 3165, "521/Origin Down", 1544, "524/Origin Time-out", 315, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, null, null], "isController": false}, {"data": ["PDP", 192000, 1800, "500/HTTP\/1.1 500", 820, "521/Origin Down", 800, "401/HTTP\/1.1 401", 171, "524/Origin Time-out", 6, "503/HTTP\/1.1 503", 2], "isController": false}, {"data": [], "isController": false}, {"data": ["Checkout Process Login", 16000, 215, "521/Origin Down", 80, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: production-ap01-unilever.demandware.net", 55, "500", 53, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (production-ap01-unilever.demandware.net)", 11, "Non HTTP response code: java.net.NoRouteToHostException/Non HTTP response message: No route to host: connect", 8], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
