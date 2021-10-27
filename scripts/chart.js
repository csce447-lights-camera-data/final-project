let datalist = [];

anychart.onDocumentReady(function () {
  anychart.data.loadJsonFile("imdb.json", function (data) {
    var stage = anychart.graphics.create('graph-container');

    for (let val of Object.values(data)) {
      // console.log(val.avg_vote);
      datalist.push({x: val.avg_vote, value: val.budget, size: val.votes, movie: val.title});
    }
    console.log(datalist);

    var chart = anychart.scatter();

    // create a bubble series and set the data
    series = chart.bubble(datalist);
    
    
    // set the chart title
    chart.title("Bubble Chart: Appearance (Individual Points)");

    // enable the legend
    chart.legend(false);

    chart.container(stage).draw();
    
    // set the titles of the axes

    chart.xAxis().title("Rating");
    chart.yAxis().title("Budget");
      
    var tooltip = chart.tooltip();

    // tooltip.format(() => this.value + " test")
    tooltip.titleFormat("Title: {%movie}\nRating: {%x}\nBudget: ${%value}");
    tooltip.separator(false);
    tooltip.format("");
    
    chart.minBubbleSize("10px");
    chart.maxBubbleSize("50px");


    // scalable axes
    chart.margin({left: 10, bottom: 10 });

    // chart.interactivity().zoomOnMouseWheel(true);
    var bounds = chart.getPixelBounds();

    //create x-scroller
    var xScroller = anychart.standalones.scroller();
    xScroller.parentBounds(60, bounds.height-60, bounds.width-80, 50);
    xScroller.container(stage).draw();

    //create y-scroller
    var yScroller = anychart.standalones.scroller();
    yScroller.orientation('left');
    yScroller.parentBounds(5, 10, 0, bounds.height-60);
    yScroller.container(stage).draw();

    //place scrollers on window resize
    window.onresize = function(event) {
      var bounds = chart.getPixelBounds();
      xScroller.parentBounds(60, bounds.height-60, bounds.width-80, 50);
      yScroller.parentBounds(5, 10, 0, bounds.height-60);
    };

    //get info about scales
    var xScale = chart.xScale();
    var yScale = chart.yScale();

    var minX = xScale.minimum();
    var maxX = xScale.maximum();
    var minY = yScale.minimum();
    var maxY = yScale.maximum();

    //scroller listeners and handlers
    xScroller.listen('scrollerchange', function(e) {
      xScale.minimum(e.startRatio * maxX + minX);
      xScale.maximum(e.endRatio * maxX);
    });

    yScroller.listen('scrollerchange', function(e) {
      yScale.minimum(e.startRatio * maxY + minY);
      yScale.maximum(e.endRatio * maxY);
    });
    
    // chart.container("graph-container");

    // // initiate drawing the chart
    // chart.draw();
  });
});



const search = () => {
  const title = document.getElementById("search-title").value;
  console.log(title);
}