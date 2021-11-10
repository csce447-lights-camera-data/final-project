let dataset;
let mapping;
let series;

anychart.onDocumentReady(() => {
  anychart.data.loadJsonFile("imdb.json", (data) => {
    var stage = anychart.graphics.create('graph-container');

    let datalist = [];

    for (let val of Object.values(data)) {
      // console.log(data[val].avg_vote);
      datalist.push({x: val.avg_vote, value: val.budget, size: val.votes, 
        movie: val.original_title, income: val.worlwide_gross_income, 
        director: val.director, writer: val.writer, actors: val.actors, 
        summary: val.description, genres: val.genre});
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
    chart.margin({ left: 10, bottom: 10 });

    // chart.interactivity().zoomOnMouseWheel(true);
    var bounds = chart.getPixelBounds();

    //create x-scroller
    var xScroller = anychart.standalones.scroller();
    xScroller.parentBounds(60, bounds.height - 60, bounds.width - 80, 50);
    xScroller.container(stage).draw();

    //create y-scroller
    var yScroller = anychart.standalones.scroller();
    yScroller.orientation('left');
    yScroller.parentBounds(5, 10, 0, bounds.height - 60);
    yScroller.container(stage).draw();

    //place scrollers on window resize
    window.onresize = (event) => {
      var bounds = chart.getPixelBounds();
      xScroller.parentBounds(60, bounds.height - 60, bounds.width - 80, 50);
      yScroller.parentBounds(5, 10, 0, bounds.height - 60);
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

    chart.listen('pointClick', (e) => {
      var index = e.iterator.getIndex();
      var row = dataset.row(index);
      displayResult(row);
    })
    
    // chart.container("graph-container");

    // // initiate drawing the chart
    // chart.draw();
  });
});

const displayResult = (movie) => {
  const res = '<div align="center">' +
                  '<h2>' + movie.movie + '</h2>' +
                  '<table style="width=100%">' +
                    '<tr><td style="width: 30%"><h3>Rating</h3></td><td><h3>' + movie.x + '</h3></td></tr>' +
                    '<tr><td style="width: 30%"><h3>Budget</h3></td><td><h3>' + movie.value + '</h3></td></tr>' + 
                    '<tr><td style="width: 30%"><h3>Worldwide Gross Income</h3></td><td><h3>' + movie.income + '</h3></td></tr>' +
                    '<tr><td style="width: 30%"><h3>Genres</h3></td><td><h3>' + (movie.genres).split(', ').join('<br/>') + '</h3></td></tr>' + 
                    '<tr><td style="width: 30%"><h3>Director</h3></td><td><h3>' + (movie.director).split(', ').join('<br/>') + '</h3></td></tr>' + 
                    '<tr><td style="width: 30%"><h3>Writer</h3></td><td><h3>' + (movie.writer).split(', ').join('<br/>') + '</h3></td></tr>' + 
                    '<tr><td style="width: 30%"><h3>Actors</h3></td><td><h3>' + (movie.actors).split(', ').join('<br/>') + '</h3></td></tr>' + 
                    '<tr><td style="width: 30%"><h3>Summary</h3></td><td><h3>' + movie.summary + '</h3></td></tr>' + 
                  '</table></div>';
  document.getElementById("result").innerHTML = res;
  
}

const titleInput = document.getElementById("search-input--title");
const budgetMinInput = document.getElementById("search-input--budget-min");
const budgetMaxInput = document.getElementById("search-input--budget-max");
const ratingMinInput = document.getElementById("search-input--rating-min");
const ratingMaxInput = document.getElementById("search-input--rating-max");

const searchTitle = (filtered) => {
  const input = titleInput.value;
  const seperator = '.{0,1}'
  let regexString = seperator
  for (const c of input) { regexString += c + seperator; }
  const regex = new RegExp(regexString, 'i');
  if (input) {
    filtered = filtered.filter("movie", (title) => regex.test(title));
  }
  return filtered;
};

const searchBudget = (filtered) => {
  let inputMin = +budgetMinInput.value; // unary plus convert to number
  let inputMax = +budgetMaxInput.value; // unary plus convert to number
  if (!budgetMinInput.value) {
    inputMin = -Infinity;
  }
  if (!budgetMaxInput.value) {
    inputMax = Infinity;
  }
  if (inputMax < inputMin) {
    const temp = inputMin;
    inputMin = inputMax;
    inputMax = temp;
  }
  return filtered.filter("value", (budget) => inputMin <= budget && budget <= inputMax);
};

const searchRating = (filtered) => {
  let inputMin = +ratingMinInput.value; // unary plus convert to number
  let inputMax = +ratingMaxInput.value; // unary plus convert to number
  if (!ratingMinInput.value) {
    inputMin = -Infinity;
  }
  if (!ratingMaxInput.value) {
    inputMax = Infinity;
  }
  if (inputMax < inputMin) {
    const temp = inputMin;
    inputMin = inputMax;
    inputMax = temp;
  }
  return filtered.filter("x", (rating) => inputMin <= rating && rating <= inputMax);
};

const search = () => series.data(
  searchRating(
    searchBudget(
      searchTitle(
        mapping
      )
    )
  )
);

// Cause submission of form to call search()
const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  search();
});
