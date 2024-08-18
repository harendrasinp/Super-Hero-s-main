// Html Element fetching by DOM
const userInput = document.querySelector("#user-input");
const btn = document.querySelector("#btn");
const imgesection = document.querySelector("#images");
const dtLoading = document.querySelector("#load");

// variable for API where it store fetch Data
let heros;
// initialy loading message is not getting Displayed till no text inside the search box
dtLoading.style.display = "none";
// -----------------------timestamp-------------------------------------
let ts = Date.now().toString();
// ------------------------marvel keys-----------------------------------
let privateKey = "13a37d9ec1a99a33d7f4cb7424b61d040c0b2134";
let publicKey = "e40adcdc6765246a7a4bd76aa8be2b03";
// --------------------------md5 digest value-----------------------------
let hashvalue = CryptoJS.MD5(ts + privateKey + publicKey).toString();

// -----------------debounce-function------------------------------------
//debounce function have parameter like
// func-callServer function
// tm- 500milisecond
// fn-load function
function debounce(func, tm, fn) {
  let timeOutId;
  // debounnce function return function which calls CallServer after 500 milisecond
  return function (...args) {
    // load function call after geting text in serach box
    fn();
    //on hiting every charecter it clear the Settimeout function and stuck to run callServer function 
    clearTimeout(timeOutId);
    // after 500 milisecond delay of typing setTimeOut function runse
    timeOutId = setTimeout(() => {
      func(...args);
    }, tm);
  };
};
// CallServer function called by debounce function
// callServer function Fetch's API data 
async function callServer() {
  imgesection.textContent = ``;
  const inputData = userInput.value;
  const heroName = await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${inputData}&ts=${ts}&apikey=${publicKey}&hash=${hashvalue}`)
  if (heroName.ok == false) {
    console.log("Sorry");
    dtLoading.style.display = "none";
  };
  let jsonName = await heroName.json();
  heros = jsonName["data"]["results"];
  loopfunction(heros);
  dtLoading.style.display = "none";
};
// when search box have input it will all debounce function with parameter
// callServer function, load function and time;
userInput.addEventListener("input", debounce(callServer, 500, load));

function load() {
  dtLoading.style.display = "block";
}
// --------------------------------function which adds proper data to proper place------------------------------------------------
function loopfunction(heros) {
  heros.forEach(element => {
    const mainFram = document.createElement("div");
    mainFram.classList.add("main-fram");

    mainFram.innerHTML = `<img src="${element["thumbnail"].path}.${element["thumbnail"].extension}"id="img-fram">
                          <div id="detail-div">
                            <div class="h-id">Id: ${element["id"]}</div>
                            <div class="h-name">Name: ${nameSize(element["name"])}</div>
                            <div class="h-comics">Comics: ${element["comics"].available}</div>
                          </div>
                          <div id="btn-div">
                            <button type="submit" class="add-btn" id="detail-view" heroPass=${element["id"]}>Detail</button>
                            <button type="submit" class="add-btn" id="add-fav" heroPass=${element["id"]}>Add to Favourite</button>
                          </div>`
    imgesection.appendChild(mainFram);
    const hBtn = mainFram.querySelector("#add-fav");
    hBtn.addEventListener("click", () => {
      hBtn.style.backgroundColor = "black";
      hBtn.style.border = "1px solid red"
      hBtn.style.color = "red";
      btnFunnction(hBtn);
      hBtn.innerHTML = "Added Succesfully"
    });
    const detailBtn = mainFram.querySelector("#detail-view");
    function loadData() {
      const opnwindow = window.open("detail.html");
      opnwindow.onload = function () {
        const detailData = opnwindow.document.getElementById("herosDetail");
        detailData.innerHTML = `<div id="imgage-box">
                                <div id="image">
                                <img src="${element["thumbnail"].path}.${element["thumbnail"].extension}"id="img-fram">
                                </div>
                              </div>
                              <div id="detail-box">
                                <div id="all-detail">
                                  <div id="hid" class="all">Id: ${element["id"]}</div>
                                  <div id="hName" class="all">Name: ${element["name"]}</div>
                                  <div id="hcomic" class="all">Comics: ${element["comics"].available}</div>
                                  <div id="disc" class="all">
                                    <label>Discription:</label>
                                    <div id="detail">${dicCheck(element["description"])}</div>
                                  </div>
                                </div>
                              </div>`
      }
    }
    detailBtn.addEventListener("click", loadData);
    detailBtn.addEventListener("touchstart", loadData);
  });
};
// -------------------------hero-name size-reduce-function-----------------------------------
function nameSize(name) {
  return name.substring(0, 12)
}

// ----------------------------click-function-on-btn---------------------------------
function btnFunnction(btn) {
  const hrId = btn.getAttribute("heroPass");
  heros.forEach(ele => {
    if (ele["id"] == hrId) {
      localStorageFunction(ele);
    }
  })
}
// -----------------------------localStorageFunction------------------------------------------
function localStorageFunction(ele) {
  const eleId = ele["id"];
  localStorage.setItem(eleId, JSON.stringify(ele));
}

function dicCheck(disc) {
  if (!disc) {
    return "No Discription";
  }
  return disc;
}