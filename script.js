let countriesButtons = document.querySelector(".countriesButtons");
let continentsButtons = document.querySelector(".continentsButtons");
let continents = document.querySelector("#continents");

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
      btnOfCountry.classList.add("btnContinent");
      btnOfCountry.innerText = `${oCD.name.common}`;
      countriesButtons.append(btnOfCountry);
    });
  } catch (err) {
    console.error(err);
  }

  await draw(arrOfContinentsCountry, arrOfPopulationsCountry);

  //ctx.appendChild(Chart);
}

async function getCountry(event) {
  countriesButtons.style.visibility = "none";

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
  if (!res.ok) throw new Error("error");
  const data1 = await res.json();
  console.log(data1.data[1]);
  data1.data.forEach((city) => {
    arrOfCities.push(city.city);
    arrOfPopulationsCities.push(city.populationCounts[0].value);
  });
  await draw(arrOfCities, arrOfPopulationsCities);
  console.log(arrOfCities);
  console.log(arrOfPopulationsCities);
}

async function draw(arrOfContinentsCountry, arrOfPopulationsCountry) {
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
          label: "# of Population",
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
