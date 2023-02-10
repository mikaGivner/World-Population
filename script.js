let loader = document.querySelector(".loader");
let countriesButtons = document.querySelector(".countriesButtons");
let continentsButtons = document.querySelector(".continentsButtons");
let continents = document.querySelector("#continents");
let errorMes = document.querySelector(".errorMes");
errorMes.style.display = "none";
let btnContinent = document.querySelectorAll(".btnContinent");
let arrOfCountryButton = [];
const ctx = document.getElementById("myChart");
let arrOfContinentsCountry = [];
let arrOfPopulationsCountry = [];
let arrOfCities = [];
let arrOfPopulationsCities = [];
let isChart = false;
let myChart;
continentsButtons.addEventListener("click", getContinent);
countriesButtons.addEventListener("click", getCountry);

async function getContinent(e) {
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

  await draw(arrOfContinentsCountry, arrOfPopulationsCountry);
}

async function getCountry(event) {
  if (event.target.className === "btnContinent") {
    arrOfCountryButton.forEach((btnCountry) => {
      btnCountry.style.border = "2px solid #fff";
    });
    event.target.style.border = "2px solid purple ";
  }
  ctx.style.visibility = "visible";
  errorMes.style.display = "none";
  //countriesButtons.style.visibility = "hidden";

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
  const data1 = await res.json();
  console.log(data1.data[1]);
  data1.data.forEach((city) => {
    arrOfCities.push(city.city);
    arrOfPopulationsCities.push(city.populationCounts[0].value);
  });
  await draw(arrOfCities, arrOfPopulationsCities);
}

function draw(arrOfContinentsCountry, arrOfPopulationsCountry) {
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
////////////////////////////
//       spinner         //
///////////////////////////

function displayLoading() {
  loader.classList.add("display");
  setTimeout(() => {
    loader.classList.remove("display");
  }, 5000);
}

function hiddenLoading() {
  loader.classList.remove("display");
}
