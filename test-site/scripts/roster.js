async function populate() {
  const requestURL =
    //"https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";
  "https://mintetang.github.io/web-projects/test-site/scripts/superheros.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroes = await response.json();

  populateHeader(superHeroes);
  populateHeroes(superHeroes);
}
function populateHeader(obj) {
  const header = document.querySelector("header");
  const myH1 = document.createElement("h1");
  myH1.textContent = obj.squadName;
  header.appendChild(myH1);

  const myPara = document.createElement("p");
  myPara.textContent = `地點: ${obj.homeTown} // 主後: ${obj.formed}`;
  header.appendChild(myPara);
}
function populateHeroes(obj) {
  const section = document.querySelector("section");
  const heroes = obj.members;

  for (const hero of heroes) {
    const mySbl = document.createElement("article");
    const myH2 = document.createElement("h2");
    const myPara1 = document.createElement("p");
    const myPara2 = document.createElement("p");
    // Create a new input element
    const myInput1 = document.createElement('input');
    // Set its attributes
    myInput1.type = 'radio';
    myInput1.name = 'att';
    myInput1.id = 'att';

    //const myPara3 = document.createElement("p");
    //const myList = document.createElement("ul");

    myH2.textContent = hero.name;
    myPara1.textContent = `職務: ${hero.secretIdentity}`;
    myPara2.textContent = `年齡: ${hero.age}`;
    //myPara3.textContent = "專長:";

    //const superPowers = hero.powers;
    //for (const power of superPowers) {
    //  const listItem = document.createElement("li");
    //  listItem.textContent = power;
    //  myList.appendChild(listItem);
    //}

    mySbl.appendChild(myH2);
    mySbl.appendChild(myPara1);
    mySbl.appendChild(myPara2);
    //mySbl.appendChild(myPara3);
    //mySbl.appendChild(myList);

    section.appendChild(mySbl);
  }
}
populate();