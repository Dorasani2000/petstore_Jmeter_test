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

    var data = {"OkPercent": 64.70588235294117, "KoPercent": 35.294117647058826};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5294117647058824, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff=-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff=-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-18"], "isController": false}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=AV-CB-01"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.0, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS"], "isController": false}, {"data": [1.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.0, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}, {"data": [0.5, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff="], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17, 6, 35.294117647058826, 3058.882352941176, 4, 24086, 518.0, 13114.79999999999, 24086.0, 24086.0, 0.2243424785884899, 0.8987746323092759, 0.04913935379468704], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action", 4, 2, 50.0, 2386.5, 286, 4989, 2135.5, 4989.0, 4989.0, 4989.0, 0.052792038960524756, 0.17064614156185245, 0.007011442674444693], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=-0", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 0.7745150862068966, 0.7004310344827587], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=-1", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 21.90972222222222, 0.8637152777777778], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-18", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 23.31293845663265, 1.1559311224489794], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=AV-CB-01", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 7.20093178986711, 0.2887510382059801], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 18.57228322072072, 0.9281742680180181], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 1, 1, 100.0, 10372.0, 10372, 10372, 10372.0, 10372.0, 10372.0, 10372.0, 0.09641342074816814, 0.2707861309294254, 0.0], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 1, 1, 100.0, 4946.0, 4946, 4946, 4946.0, 4946.0, 4946.0, 4946.0, 0.2021835826930853, 0.5678515467044076, 0.0], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 66.162109375, 0.0], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 1, 1, 100.0, 24086.0, 24086, 24086, 24086.0, 24086.0, 24086.0, 24086.0, 0.041517894212405544, 0.08425213298181516, 0.0], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 2, 0, 0.0, 204.5, 197, 212, 204.5, 212.0, 212.0, 212.0, 1.3020833333333333, 5.7760874430338545, 1.0248819986979167], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1, 1, 100.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 25.73951655982906, 0.37059294871794873], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 9.950380067567567, 0.7672991071428571], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 1, 16.666666666666668, 5.882352941176471], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: petstore.octoperf.com:443 failed to respond", 1, 16.666666666666668, 5.882352941176471], "isController": false}, {"data": ["500", 1, 16.666666666666668, 5.882352941176471], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to petstore.octoperf.com:443 [petstore.octoperf.com/78.46.109.21] failed: Connection refused (Connection refused)", 3, 50.0, 17.647058823529413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to petstore.octoperf.com:443 [petstore.octoperf.com/78.46.109.21] failed: Connection refused (Connection refused)", 3, "503/Service Temporarily Unavailable", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: petstore.octoperf.com:443 failed to respond", 1, "500", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action", 4, 2, "503/Service Temporarily Unavailable", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to petstore.octoperf.com:443 [petstore.octoperf.com/78.46.109.21] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to petstore.octoperf.com:443 [petstore.octoperf.com/78.46.109.21] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to petstore.octoperf.com:443 [petstore.octoperf.com/78.46.109.21] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: petstore.octoperf.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 1, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
