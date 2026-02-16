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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9210526315789473, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff=-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff=-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-18"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=AV-CB-01"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff="], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19, 0, 0.0, 361.57894736842104, 7, 2449, 235.0, 564.0, 2449.0, 2449.0, 0.4770872567482737, 1.9804908192090394, 0.14644146264908975], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action", 4, 0, 0.0, 786.75, 189, 2449, 254.5, 2449.0, 2449.0, 2449.0, 0.10048231511254019, 0.5160757966363545, 0.019012156790092445], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=-0", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.1577802835051545, 1.0470360824742269], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=-1", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 26.083002645502646, 1.0282324735449735], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-18", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 20.810589519650655, 0.9893558951965065], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=AV-CB-01", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 16.00609756097561, 0.917016006097561], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.9557845744680852, 2.1525930851063833], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 15.577070552147239, 0.5961225076687117], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 22.53297899590164, 0.8444864241803279], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 9.40201130319149, 1.241481050531915], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 15.041265272556391, 0.774641682330827], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 95.84263392857143, 0.0], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 19.34094551282051, 1.1518429487179487], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 2, 0, 0.0, 206.5, 193, 220, 206.5, 220.0, 220.0, 220.0, 1.304631441617743, 6.137755830071755, 1.0268876386170906], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 23.109172952586206, 0.9344692887931034], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 13.457694190600522, 1.0377570169712793], "isController": false}]}, function(index, item){
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
