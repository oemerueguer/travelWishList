const express = require("express");
const app = express();
app.use(express.json());
const countries = require("./countries");

const PORT = 4001;

wishListRouter = express.Router();
app.use("/api/countries", wishListRouter);

const compare = (a, b) => {
  // Use toUpperCase() to ignore character casing
  const countryA = a.name.toUpperCase();
  const countryB = b.name.toUpperCase();

  let comparison = 0;
  if (countryA > countryB) {
    comparison = 1;
  } else if (countryA < countryB) {
    comparison = -1;
  }
  return comparison;
};

const pushObject = (name, alpha2Code, alpha3Code, visited) => {
  const newCountry = {
    id: countries.length + 1,
    name: name,
    alpha2Code: alpha2Code,
    alpha3Code: alpha3Code,
    visited: visited,
  };
  countries.push(newCountry);
  return newCountry;
};

wishListRouter.get("/", (req, res) => {
  const sortCountries = req.query.sort;
  const visitedCountries = req.query.visited;
  if (visitedCountries === "true") {
    const newArray = countries.filter((e) => e.visited === "true");

    if (sortCountries) {
      newArray.sort(compare);
    }
    res.send(newArray);
  } else {
    if (sortCountries) {
      const cloneArray = countries.slice();
      cloneArray.sort(compare);
      res.send(cloneArray);
    } else {
      res.send(countries);
    }
  }
});

wishListRouter.post("/", (req, res) => {
  const getCountry = countries.find((e) => e.name === req.query.name);
  const getAlpha2Code = countries.find(
    (e) => e.alpha2Code === req.query.alpha2Code
  );
  const getAlpha3Code = countries.find(
    (e) => e.alpha3Code === req.query.alpha3Code
  );
  if (getCountry) {
    if (getAlpha2Code === undefined && getAlpha3Code === undefined) {
      const newCountry = pushObject(
        req.query.name,
        req.query.alpha2Code,
        req.query.alpha3Code,
        req.query.visited
      );
      res.status(201).send(newCountry);
    } else {
      res.send("The entry already exist.");
    }
  } else {
    const newCountry = pushObject(
      req.query.name,
      req.query.alpha2Code,
      req.query.alpha3Code,
      req.query.visited
    );
    res.status(201).send(newCountry);
  }
});

wishListRouter.get("/:name", (req, res) => {
  const getCountry = countries.find((e) => e.name === req.params.name);
  if (getCountry) {
    res.status(200).send(getCountry);
  } else {
    res.status(404).send("The Country does not exist on the API.");
  }
});

wishListRouter.put("/:name", (req, res) => {
  let countryName = req.params.name;
  const getCountry = countries.find((e) => e.name === countryName);
  if (getCountry) {
    getCountry.name = req.body.name;
    getCountry.alpha2Code = req.body.alpha2Code;
    getCountry.alpha3Code = req.body.alpha3Code;
    getCountry.visited = req.body.visited;
    res.send(getCountry);
  } else {
    res.status(404).send("The Country does not exist on the API.");
  }
});

wishListRouter.delete("/:name", (req, res) => {
  let countryName = req.params.name;
  const getCountry = countries.find((e) => e.name === countryName);
  const index = countries.indexOf(getCountry);
  countries.splice(index, 1);
  res.send("Country has been deleted");
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
