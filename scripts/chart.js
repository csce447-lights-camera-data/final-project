anychart.onDocumentReady(function () {

  // create data
  var data = [
    {x: "2000", value: 1100, size: 3},
    {x: "2001", value: 880, size: 4},
    {x: "2002", value: 1100, size: 4},
    {x: "2003", value: 1300, size: 5,
     normal:   {
         fill: "#b30059 0.3",
         stroke: "#b30059"
       },
     hovered:  {
         fill: "#b30059 0.1",
         stroke: "2 #b30059"
       },
     selected: {
         fill: "#b30059 0.5",
         stroke: "4 #b30059"
       }
    },
    {x: "2004", value: 921, size: 4.5},
    {x: "2005", value: 1000, size: 3},
    {x: "2006", value: 1400, size: 4}
  ];

  // create a chart
  var chart = anychart.scatter();

  // set the interactivity mode
  // chart.interactivity().hoverMode("by-x");

  // create a bubble series and set the data
  series = chart.bubble(data);
  
  // set the chart title
  chart.title("Bubble Chart: Appearance (Individual Points)");

  // enable the legend
  chart.legend(true);

  // set the titles of the axes
  chart.xAxis().title("Year");
  chart.yAxis().title("Sales, $");
  
  // set the container id
  chart.container("graph-container");

  // initiate drawing the chart
  chart.draw();
});