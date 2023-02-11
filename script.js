let years = document.querySelector(".years");
let btnYears = document.querySelectorAll(".btnYears");
let countriesButtons = document.querySelector(".countriesButtons");
let continentsButtons = document.querySelector(".continentsButtons");
let continents = document.querySelector("#continents");
let errorMes = document.querySelector(".errorMes");
let btnContinent = document.querySelectorAll(".btnContinent");
const ctx = document.getElementById("myChart");
let arrOfCountryButton = [];
let arrOfContinentsCountry = [];
let arrOfPopulationsCountry = [];
let arrOfCities = [];
let arrOfPopulationsCities = [];
let isChart = false;
let whichYear = 0;
let myChart;
let data1;

years.style.visibility = "hidden";
errorMes.style.display = "none";

continentsButtons.addEventListener("click", getContinent);
countriesButtons.addEventListener("click", getCountry);

years.addEventListener("click", changeYear);

async function getContinent(e) {
  years.style.visibility = "hidden";
  btnContinent.forEach((btn) => {
    btn.style.border = "none";
  });
  if (e.target.value !== undefined) {
    e.target.style.border = "2px solid red";
  }
  countriesButtons.style.visibility = "visible";
  arrOfContinentsCountry = [];
  arrOfPopulationsCountry = [];
  arrOfCities = [];
  arrOfPopulationsCities = [];

  countriesButtons.innerHTML = " ";

  try {
    let continentData = await fetch(
      `https://restcountries.com/v3.1/region/${e.target.value}`
    );
    if (!continentData.ok) throw new Error("error");

    objContinentData = await continentData.json();
    console.log(objContinentData);
    objContinentData.forEach((oCD) => {
      arrOfContinentsCountry.push(oCD.name.common);
      arrOfPopulationsCountry.push(oCD.population);
      let btnOfCountry = document.createElement("button");
      btnOfCountry.style.border = "2px solid #fff";
      btnOfCountry.style.borderRadius = "0.5rem";
      btnOfCountry.style.background = "#fff";
      btnOfCountry.classList.add("btnContinent");
      btnOfCountry.innerText = `${oCD.name.common}`;
      arrOfCountryButton.push(btnOfCountry);
      countriesButtons.append(btnOfCountry);
    });
  } catch (err) {
    console.error(err);
  }

  await drawChart(arrOfContinentsCountry, arrOfPopulationsCountry);
}

async function getCountry(event) {
  arrOfPopulationsCities = [];
  arrOfCities = [];
  years.style.visibility = "visible";

  if (event.target.className === "btnContinent") {
    arrOfCountryButton.forEach((btnCountry) => {
      btnCountry.style.border = "2px solid #fff";
    });
    event.target.style.border = "2px solid purple ";
  }
  ctx.style.visibility = "visible";
  errorMes.style.display = "none";

  const res = await fetch(
    "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: 1000,
        order: "asc",
        orderBy: "name",
        country: `${event.target.innerText}`,
      }),
    }
  );
  if (!res.ok) {
    errorMes.style.display = "block";
    ctx.style.visibility = "hidden";
    throw new Error("error");
  }
  data1 = await res.json();
  console.log(data1.data[1]);
  btnYears.forEach((someYear) => {
    someYear.style.border = "none";
  });
  btnYears[0].style.border = "2px solid red";
  whichYear = 0;
  data1.data.forEach((city) => {
    arrOfCities.push(city.city);
    arrOfPopulationsCities.push(city.populationCounts[0].value);
  });
  await drawChart(arrOfCities, arrOfPopulationsCities);
}

function changeYear(eClick) {
  btnYears.forEach((someYear) => {
    someYear.style.border = "none";
  });
  eClick.target.style.border = "2px solid red";
  btnYears.forEach((x, index) => {
    if (x.value === eClick.target.value) whichYear = index;
  });
  if (data1.data[1].populationCounts.length > whichYear) {
    errorMes.style.display = "none";
    arrOfPopulationsCities = [];
    arrOfCities = [];
    data1.data.forEach((city) => {
      arrOfCities.push(city.city);
      arrOfPopulationsCities.push(city.populationCounts[whichYear].value);
    });
    drawChart(arrOfCities, arrOfPopulationsCities);
    console.log("whichYear:", whichYear);
  } else {
    errorMes.style.display = "block";
  }
}

function drawChart(arrOfContinentsCountry, arrOfPopulationsCountry) {
  arrOfCities = [];
  arrOfPopulationsCities = [];
  if (isChart === true) {
    myChart.destroy();
  }
  isChart = true;
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: arrOfContinentsCountry,
      datasets: [
        {
          label: "Population",
          data: arrOfPopulationsCountry,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
