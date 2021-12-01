import setSeriesAndMapping from "./search.js";

let dataset;
let mapping;
let series;

let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

anychart.onDocumentReady(() => {
  anychart.data.loadJsonFile("imdb.json", (data) => {
    let datalist = [];

    for (let val of Object.values(data)) {
      // color1 = 0xE82C0C; 
      const color1_r = 0xE8;
      const color1_g = 0x2C;
      const color1_b = 0x0C;
      // color2 = 0x003C78;
      const color2_r = 0x00;
      const color2_g = 0x3C;
      const color2_b = 0x78;
      const alpha = val.avg_vote / 10;

      const rr = Math.trunc(((1 - alpha) * color1_r + alpha * color2_r));
      const rg = Math.trunc(((1 - alpha) * color1_g + alpha * color2_g));
      const rb = Math.trunc(((1 - alpha) * color1_b + alpha * color2_b));

      const lerp = Number((rr << 16) + (rg << 8) + rb).toString(16);

      // console.log(lerp);
      const normal_fill = `#${lerp} 0.5`;
      const normal_stroke = `#${lerp}`;
      datalist.push({
        x: val.budget, value: val.worlwide_gross_income, size: val.votes,
        movie: val.original_title, rating: val.avg_vote,
        director: val.director, writer: val.writer, actors: val.actors,
        summary: val.description, genres: val.genre,
        normal: {
          fill: normal_fill,
          stroke: normal_stroke
        }
      });
    }

    dataset = anychart.data.set(datalist)
    mapping = dataset.mapAs()

    var chart = anychart.scatter();

    // create a bubble series and set the data
    series = chart.bubble(dataset);
    // link series and mapping to the search form
    setSeriesAndMapping(series, mapping);

    // set the chart title
    chart.title("Movies Data");

    // enable the legend
    chart.legend(false);

    // set the titles of the axes

    chart.xAxis().title("Budget");
    chart.yAxis().title("Revenue");

    var tooltip = chart.tooltip();

    tooltip.titleFormat("{%movie}");
    // Must use old style function, not sure why
    tooltip.format(function () {
      return `Rating: ${this.getData('rating')}\nBudget: ${formatter.format(this.x)}\nRevenue: ${formatter.format(this.value)}`
    });

    chart.minBubbleSize("10px");
    chart.maxBubbleSize("50px");

    chart.listen('pointClick', (e) => {
      var index = e.iterator.getIndex();
      var row = series.data().row(index);
      displayResult(row);
    })

    chart.container("graph-container");

    // initiate drawing the chart
    chart.draw();
  });
});

const collapseResult = () => {
  document.getElementById("result-wrapper").removeChild(document.getElementById("result"));
  document.getElementById("result-wrapper").className = "no-result";
}

const displayResult = (movie) => {
  if (document.body.contains(document.getElementById("result"))) {
    collapseResult();
  }
  let result = document.createElement('div');
  result.id = "result";
  document.getElementById('result-wrapper').appendChild(result);
  document.getElementById("result-wrapper").className = "result-display";
  const res = `
  <div align="center">
    <span id="close" style="cursor: pointer; float: right">&#10006</span>
    <h2>${movie.movie}</h2>
    <table style="width=100%">
      <tr><td style="width: 30%"><h3>Summary</h3></td><td><h3>${movie.summary}</h3></td></tr>
      <tr><td style="width: 30%"><h3>Budget</h3></td><td><h3>${formatter.format(movie.x)}</h3></td></tr>
      <tr><td style="width: 30%"><h3>Worldwide Gross Income</h3></td><td><h3>${formatter.format(movie.value)}</h3></td></tr>
      <tr><td style="width: 30%"><h3>Rating</h3></td><td><h3>${movie.rating}</h3></td></tr>
      <tr><td style="width: 30%"><h3>Genres</h3></td><td><h3>${(movie.genres).split(', ').join('<br/>')}</h3></td></tr>
      <tr><td style="width: 30%"><h3>Director</h3></td><td><h3>${(movie.director).split(', ').join('<br/>')}</h3></td></tr>
      <tr><td style="width: 30%"><h3>Writer</h3></td><td><h3>${(movie.writer).split(', ').join('<br/>')}</h3></td></tr>
      <tr><td style="width: 30%"><h3>Actors</h3></td><td><h3>${(movie.actors).split(', ').join('<br/>')}</h3></td></tr>
    </table>
  </div>
  `;
  document.getElementById("result").innerHTML = res;
  document.getElementById("close").addEventListener("click", collapseResult);
};

