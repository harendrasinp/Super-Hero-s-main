const cardFram = document.querySelector(".card-fram");
const detailBox = document.querySelector("#detail-box");
const removeAll = document.querySelector("#removeAll");


function loadDatafunction() {
    let dataArray = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key)
        const allData = JSON.parse(value);
        dataArray.push(allData);
    }
    uploadFunction(dataArray);
}
function uploadFunction(dataArray) {
    cardFram.innerHTML = ``;
    dataArray.forEach(element => {
        // console.log(element);
        const im = element["thumbnail"].path;
        const ext = element["thumbnail"].extension;
        const heroId = element["id"];
        const heroName = element["name"];
        const heroComics = element["comics"].available;
        // ------------------------------------------
        // const disc= element.description;
        // storyFunction(disc);
        // -------------------------------------------
        const cards = document.createElement("div");
        cards.classList.add("card");
        cards.innerHTML = `
                        <img src="${im}.${ext}" alt="">
                        <div id="detail">
                            <div id="heroid" class="hero-detail">ID: ${heroId}</div>
                            <div id="heroname" class="hero-detail">NAME: ${trimName(heroName)}</div>
                            <div id="herocomic" class="hero-detail">COMICS: ${heroComics}</div>
                        </div>
                        <div id="btn-div">
                            <button id="view-btn" hid="${heroId}">Viwe Detail</button>
                            <button heroid=${heroId} id="r-btn">Remove</button>
                        </div>`
        cardFram.append(cards);
        // ----------------------View-detail-btn-------------------------------------
        const viewBtn = cards.querySelector("#view-btn");
        viewBtn.addEventListener("click", () => {
            detailBox.innerHTML = ``;
            detailBox.style.display = "block";
            const hid = viewBtn.getAttribute("hid")
            detailBoxDataFunction(hid);
        })
        // --------------------------remove-btn-------------------------------
        const removeBtn = cards.querySelector("#r-btn");
        removeBtn.addEventListener("click", () => {
            const removeId = removeBtn.getAttribute("heroid");
            removeFunction(removeId)
        });

    });
};
// ----------------------name trimfunction----------------------------------
function trimName(name) {
    return name.substring(0, 12);
}
// --------------------delete data from localstorage------------------------
function removeFunction(id) {
    localStorage.removeItem(id);
    loadDatafunction();
}
// -----------------------detailbox function-----------------------------------
function detailBoxDataFunction(hid) {
    const heroAllData = localStorage.getItem(hid);
    const data = JSON.parse(heroAllData);
    console.log(data);
    const detailSection = document.createElement("div");
    detailSection.classList.add("d-section");
    detailSection.innerHTML = `
        <div id="close-btn">
             <i class="fa-sharp fa-solid fa-xmark" id="close-btn"></i>
        </div>

        <div id="hero-name">${data.name}</div>
        <div id="all-Detail">
            <div id="hero-img">
                <img src="${data["thumbnail"].path}.${data["thumbnail"].extension}" alt="">
            </div>
            <div id="doc-detail">
                <div id="id" class="doc-class">ID:${data.id}</div>
                <div id="comics" class="doc-class">Comics: ${data["comics"].available}</div>
                <div id="story"class="doc-class">Stories: ${data["stories"].available}</div>
                <div id="disc"class="doc-class">Description:${discFunction(data.description)}</div>

            </div>
        </div>
        `
    detailBox.append(detailSection);
    const closeBtn = detailSection.querySelector("#close-btn");
    closeBtn.addEventListener("click", () => {
        detailBox.style.display = "none"
    })
}
// ----------------------remove-all-but----------------------------------------
removeAll.addEventListener("click",()=>{
   const yes=confirm("Hey I am Removing all cards from Your favourite Box ")
   console.log(yes);
   if(yes==true){
    localStorage.clear();
    loadDatafunction();
   }
})
// -------------------cheching discription--------------------------------------
function discFunction(disc){
        if(!disc){
               return "Not Available" 
        }
        else{
            return disc
        }
}
loadDatafunction();

