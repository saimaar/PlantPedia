const divDropContent = document.getElementById('dropdown-genera')
const divPlantContent = document.getElementById('dropdown-plants')
const genusButton = document.getElementById('button-genera')
const plantButton =  document.getElementById('button-plant')
const plantCollection = document.querySelector(".plant-collection")
const main = document.querySelector(".main")
const container = document.querySelector(".container")

fetch("http://localhost:3000/families")
.then((resp) => {
  return resp.json()
})
.then((familyArray) => {
  familyArray.forEach((family) => {
    familyNameOnDrp(family)
    plantNameOnDrp(family)
    indexPage(family)
  })

//------------------Genus Name ----------------------------------------//
  genusButton.addEventListener("click", (evt) => {
//line 17 can be rewritten as evt.target.nextElementSibling.className.includes("show")
    if (divDropContent.className.includes("show")){
     divDropContent.classList.remove("show")
   } else {
     divDropContent.classList.add("show")
   }
 }) // end of addEventListener

//================PLant Name ==========================================//
  plantButton.addEventListener("click", (evt) => {

    if (divPlantContent.className.includes("show")){
      divPlantContent.classList.remove("show")
    } else {
      divPlantContent.classList.add("show")
    }
  }) // end of addEventListener of plant button
})  // end of first fetch

//====================Home Page addEventListener ====================//
function indexPage(family){
  family.plants.forEach((plantObj) => {
    const plantCard = document.createElement("div")
    plantCard.className = "card"
    const plantImg = document.createElement("img")
    plantImg.className = "plant-img"
    plantImg.src = plantObj.image
    const h3 = document.createElement("h3")
    h3.innerText = plantObj.name
    plantCard.append(plantImg, h3)
    plantCollection.append(plantCard)

    plantImg.addEventListener("click", (evt) => {
        plantCollection.classList.add("hide")
        fetch(`http://localhost:3000/plants/${plantObj.id}`)
        .then((resp) => {
          return resp.json()
        })
        .then((plant) => {
          soloDisplayOnDom(plant)
        })


    })// end of addEventListener
  })//end of forEach
}// end of indexPage

//=================================SHOW ONE PLANT =================================//
function soloDisplayOnDom(plant){
  const plantSoloCard = document.createElement("div")
  plantSoloCard.className = "solo-card"
  const soloImage = document.createElement("img")
  soloImage.className = "solo-img"
  soloImage.src = plant.image
  const soloName = document.createElement("h2")
  soloName.innerText = `${plant.name}  | Genus: ${plant.family.name}`

  const plantDesc = document.createElement("p")
  plantDesc.className = "desc"
  plantDesc.innerText = plant.description
  const desch2 = document.createElement("h2")
  desch2.innerText = "Description"
  const soloDiv = document.createElement("div")
  soloDiv.className = "name-desc-container"

  const loves = document.createElement("div")
  loves.innerText = `${plant.loves} loves`

  const loveButton = document.createElement("img")
  loveButton.className = "love-button"
  loveButton.src =  "https://feea.org/wp-content/uploads/2018/05/fb-love-button.png"

  const careh2 = document.createElement("h2")
  careh2.innerText = "Care"
  const carePara = document.createElement("p")
  carePara.className = "desc"
  carePara.innerText = plant.care

  const xButton = document.createElement("button")
  xButton.className = "x-button"
  xButton.innerText = "x"


  soloDiv.append(soloName, desch2, plantDesc, careh2, carePara, loves, loveButton)
  plantSoloCard.append( soloImage, soloDiv, xButton)
  container.append(plantSoloCard)


  xButton.addEventListener("click", (evt) => {
      plantCollection.classList.remove("hide")

  })

}//end of function



//====================genusName addEventListener ====================//
function familyNameOnDrp(family){
    const genusName = document.createElement("a")
    genusName.innerText = family.name
    divDropContent.appendChild(genusName)

    genusName.addEventListener("click", (evt) => {
      console.log("click me");
    })
}

//====================plantName addEventListener ====================//
function plantNameOnDrp(family){
  family.plants.forEach((plantObj) => {
    const plantName = document.createElement("a")
    plantName.innerText = plantObj.name
    divPlantContent.appendChild(plantName)
  })
}
