const userInput = document.querySelector("#user-input");
const btn = document.querySelector("#btn");
const imgesection = document.querySelector("#images");
const dtLoading= document.querySelector("#load");

dtLoading.style.display="none";
// -----------------------timestamp-------------------------------------
let ts = Date.now().toString();
// ------------------------marvel keys-----------------------------------
let privateKey = "13a37d9ec1a99a33d7f4cb7424b61d040c0b2134";
let publicKey = "e40adcdc6765246a7a4bd76aa8be2b03";
// --------------------------md5 digest value-----------------------------
let hashvalue = CryptoJS.MD5(ts + privateKey + publicKey).toString();
// -----------------------------------------debounce-function---------------------------------
function debounce(func,tm,fn) {
  let timeOutId;
  return function (...args) {
    fn();
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      func(...args);
      console.log(func);
    }, tm);
  };
};
async function callServer() {
  imgesection.textContent=``;
  const inputData = userInput.value;
  const heroName = await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${inputData}&ts=${ts}&apikey=${publicKey}&hash=${hashvalue}`)
  if (heroName.ok == false) {
    console.log("Sorry");
    dtLoading.style.display="none";
  };
  let jsonName = await heroName.json();
  heros = jsonName["data"]["results"];
  loopfunction(heros);
  dtLoading.style.display="none";
};
userInput.addEventListener("input",debounce(callServer,500,load));

function load(){
    dtLoading.style.display="block";
}
// --------------------------------function which adds proper data to proper place------------------------------------------------
function loopfunction(heros) {
  heros.forEach(element => {
    const mainFram = document.createElement("div");
    mainFram.classList.add("main-fram");

    mainFram.innerHTML = `<img src="${element["thumbnail"].path}.${element["thumbnail"].extension}" alt="" id="img-fram">
                                            <div id="detail-div">
                                              <div class="h-id">Id: ${element["id"]}</div>
                                              <div class="h-name">Name: ${nameSize(element["name"])}</div>
                                              <div class="h-comics">Comics: ${element["comics"].available}</div>
                                            </div>
                                                <div id="btn-div">
                                                     <button type="submit" class="add-btn" heroPass=${ element["id"]}>Add to Favourite</button>
                                                </div>`
    imgesection.appendChild(mainFram);
    const hBtn = mainFram.querySelector(".add-btn");
    hBtn.addEventListener("click", () => {
      hBtn.style.backgroundColor="black";
      hBtn.style.border="1px solid red"
      hBtn.style.color="red";
      btnFunnction(hBtn);
      hBtn.innerHTML = "Added Succesfully"
    });
  });
};
// -------------------------hero-name size-reduce-function-----------------------------------
function nameSize(name) {
  return result = name.substring(0, 12)
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


