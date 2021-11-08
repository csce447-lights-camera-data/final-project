let dataset;
let mapping;
let series;

anychart.onDocumentReady(() => {
  anychart.data.loadJsonFile("imdb.json", (data) => {
    var stage = anychart.graphics.create('graph-container');

    let datalist = [];

    for (let val of Object.values(data)) {
      // console.log(val.avg_vote);
      datalist.push({x: val.avg_vote, value: val.budget, size: val.votes, movie: val.original_title});
    }
    // console.log(datalist);
    dataset = anychart.data.set(datalist)
    mapping = dataset.mapAs()

    var chart = anychart.scatter();

    // create a bubble series and set the data
    series = chart.bubble(dataset);
    
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
    window.onresize = (event) => {
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
    xScroller.listen('scrollerchange', (e) => {
      xScale.minimum(e.startRatio * maxX + minX);
      xScale.maximum(e.endRatio * maxX);
    });

    yScroller.listen('scrollerchange', (e) => {
      yScale.minimum(e.startRatio * maxY + minY);
      yScale.maximum(e.endRatio * maxY);
    });
    
    // chart.container("graph-container");

    // // initiate drawing the chart
    // chart.draw();
  });
});

const titleInput = document.getElementById("search-input--title");
const budgetMinInput = document.getElementById("search-input--budget-min");
const budgetMaxInput = document.getElementById("search-input--budget-max");
const ratingMinInput = document.getElementById("search-input--rating-min");
const ratingMaxInput = document.getElementById("search-input--rating-max");

const search = () => {
  const input = titleInput.value;
  const seperator = '.{0,3}'
  let regexString = seperator
  for(const c of input) { regexString += c + seperator; }
  const regex = new RegExp(regexString, 'i');
  if(input) {
    const filtered = mapping.filter("movie", (title) => regex.test(title));
    series.data(filtered);
  } else {
    series.data(dataset);
  }
};

// Cause submission of form to call search()
const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  search();
});
