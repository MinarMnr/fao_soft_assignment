const fs = require("fs");
const csvParser = require("csv-parser");

//Initial variables
var result = [];
var villageCatResult = [];
const diseaseList = [];
const corruptString = `"ABB,`; // variable declare for courrupt string
var numberOfCatInVillages = 0;
var totalNumberCases = 0;

if (process.argv.length != 3) {
  var inputFile = process.argv[2] + ".csv"; // input file name getting from command line argument
  var outputFile = process.argv[3] + ".json"; // output file name getting from command line argument

  if (process.argv[3] === "advance") {
    // check output file name for advance indicators and read disease list
    fs.createReadStream("disease_list.csv")
      .pipe(csvParser())
      .on("data", (data) => {
        diseaseList.push(data.name);
      })
      .on("end", () => []);
  }

  fs.createReadStream(`${inputFile}`)
    .pipe(csvParser())
    .on("data", (data) => {
      // calculate total number of cases
      totalNumberCases += parseInt(data.total_number_cases);
      data.uuid = data.uuid.replace(corruptString, ""); // line added for corrupt uuid but not working as expected
      result.push(data);

      if (
        process.argv[3] === "advance" &&
        data.location.startsWith("Village")
      ) {
        if (data.species === "cat") {
          numberOfCatInVillages += 1;
          villageCatResult.push(data);
        }
      }
    })
    .on("end", () => {
      if (process.argv[3] !== "advance") {
        /* general output json */
        // calculate location based mortality
        let mortalityBasedOnEachLocation = result.reduce(
          (r, { location, number_mortality }) => {
            r[location] = r[location] || 0;
            r[location] += parseInt(number_mortality);
            return r;
          },
          {}
        );
        sortableOutput(mortalityBasedOnEachLocation);
      } else {
        /* advance output json */
        // only cat calculation for villages
        let numberOfSickCatInVillages = villageCatResult.reduce(
          (r, { species, number_morbidity }) => {
            r[species] = r[species] || 0;
            r[species] += parseInt(number_morbidity);
            return r;
          },
          {}
        );

        // claculate avg number of sick cats
        let avgNumberOfSickCatInVillages = (
          numberOfSickCatInVillages.cat / numberOfCatInVillages
        ).toFixed(2);

        // disease id wise mortality
        let mortalityBasedOnDiseaseID = result.reduce(
          (r, { disease_id, number_mortality }) => {
            r[disease_id] = r[disease_id] || 0;
            r[disease_id] += parseInt(number_mortality);
            return r;
          },
          []
        );

        //map disease id with mortality
        let numberOfDeathsOfEachDisease = {};
        diseaseList.forEach(function (key, i) {
          numberOfDeathsOfEachDisease[key] = mortalityBasedOnDiseaseID[i];
        });

        //output Json
        let outputJson = {
          "Average number of sick cats reported in reports from villages up to two decimal points":
            parseFloat(avgNumberOfSickCatInVillages),
          "total number of deaths from each disease":
            numberOfDeathsOfEachDisease,
        };

        fs.writeFileSync(`${outputFile}`, JSON.stringify(outputJson));
      }

      console.log("CSV file successfully processed");
    });
} else {
  console.log("Please provide valid input/output file name!");
  process.exit(1); // program exit if parameters not provided.
}

function sortableOutput(mortalityBasedOnEachLocation) {
  //sort object before output json
  let sortableOutputJson = Object.entries(mortalityBasedOnEachLocation)
    .sort(([, a], [, b]) => a - b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  //output Json
  let outputJson = {
    "total number of reported cases is": totalNumberCases,
    "total number of deaths reported at each location": sortableOutputJson,
  };
  fs.writeFileSync(`${outputFile}`, JSON.stringify(outputJson));
}
