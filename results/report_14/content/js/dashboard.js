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
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
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
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7631578947368421, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff=-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff=-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-18"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=AV-CB-01"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS"], "isController": false}, {"data": [0.75, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff="], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19, 0, 0.0, 564.9473684210526, 4, 2311, 447.0, 797.0, 2311.0, 2311.0, 0.4911083540115798, 2.034505208333333, 0.15071998261734904], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action", 4, 0, 0.0, 953.0, 399, 2311, 551.0, 2311.0, 2311.0, 2311.0, 0.10352502717531964, 0.5317031241912108, 0.019587865249236502], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=-0", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.5759214743589743, 0.5208333333333334], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=-1", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 12.1122542997543, 0.477483875921376], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-18", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 15.573937908496733, 0.7404003267973857], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=AV-CB-01", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 10.334645669291339, 0.5920890748031497], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.6745026276276276, 1.519097222222222], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 12.507697044334975, 0.47865994458128075], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 12.299881152125279, 0.4609724552572707], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 7.156186740890688, 0.9449329453441295], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 8.414884868421053, 0.43379934210526316], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 128.90625, 0.0], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 7.0029333178438655, 0.4156743726765799], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 2, 0, 0.0, 531.0, 377, 685, 531.0, 685.0, 685.0, 685.0, 1.2445550715619167, 5.855121149657747, 0.9796009645301804], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 8.444574311023622, 0.3414124015748031], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 6.467122804265997, 0.49869628293601004], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
