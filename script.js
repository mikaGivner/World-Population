let countriesButtons = document.querySelector(".countriesButtons");
let continentsButtons = document.querySelector(".continentsButtons");
const ctx = document.getElementById("myChart");
let arrOfContinentsCountry = [];
let arrOfPopulationsCountry = [];
let isChart = false;
let myChart;
continentsButtons.addEventListener("click", getContinent);
countriesButtons.addEventListener("click", getCountry);

async function getContinent(e) {
  arrOfContinentsCountry = [];
  arrOfPopulationsCountry = [];

  countriesButtons.innerHTML = " ";
  try {
    let continentData = await fetch(
      `https://restcountries.com/v3.1/region/${e.target.value}`
    );
    if (!continentData.ok) throw new Error("error");

    objContinentData = await continentData.json();
    console.log(objContinentData);
    objContinentData.forEach((oCD) => {
      arrOfContinentsCountry.push(oCD.altSpellings[1]);
      arrOfPopulationsCountry.push(oCD.population);
      let btnOfCountry = document.createElement("button");
      btnOfCountry.classList.add("btnContinent");
      btnOfCountry.innerText = `${oCD.altSpellings[1]}`;
      countriesButtons.append(btnOfCountry);
    });
  } catch (err) {
    console.error(err);
  }

  await draw();

  //ctx.appendChild(Chart);
}

async function getCountry(event) {}

async function draw() {
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
