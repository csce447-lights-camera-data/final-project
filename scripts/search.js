import { addCollapseFunctionality } from "./utility.js";

addCollapseFunctionality();

const titleInput = document.getElementById("search-input--title");
const budgetMinInput = document.getElementById("search-input--budget-min");
const budgetMaxInput = document.getElementById("search-input--budget-max");
const revenueMinInput = document.getElementById("search-input--revenue-min");
const revenueMaxInput = document.getElementById("search-input--revenue-max");
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

const swap = (a, b) => [b, a]

const searchRange = (filtered, chartval, rangeMin, rangeMax) => {
  if (rangeMax < rangeMin) {
    rangeMin, rangeMax = swap(rangeMin, rangeMax);
  }
  return filtered.filter(chartval, (val) => rangeMin <= val && val <= rangeMax);
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
  return searchRange(filtered, "x", inputMin, inputMax);
};

const searchRevenue = (filtered) => {
  let inputMin = +revenueMinInput.value; // unary plus convert to number
  let inputMax = +revenueMaxInput.value; // unary plus convert to number
  if (!revenueMinInput.value) {
    inputMin = -Infinity;
  }
  if (!revenueMaxInput.value) {
    inputMax = Infinity;
  }
  return searchRange(filtered, "value", inputMin, inputMax);
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
  return searchRange(filtered, "rating", inputMin, inputMax);
};

const search = (series, mapping) => series.data(
  searchRating(
    searchBudget(
      searchRevenue(
        searchTitle(
          mapping
        )
      )
    )
  )
);

const setSeriesAndMapping = (series, mapping) => {
  // Cause submission of form to call search()
  const searchForm = document.getElementById('search-form');

  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    search(series, mapping);
  });
};

export default setSeriesAndMapping;