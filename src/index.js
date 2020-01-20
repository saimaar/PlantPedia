const divDropContent = document.getElementById('dropdown-genera')
const genusAll = document.createElement("a")
genusAll.className = "all"
genusAll.innerText = "all";
divDropContent.appendChild(genusAll)

genusAll.addEventListener("click", (evt) => {
  plantCollection.classList.remove("hide")
  filterGenus.innerHTML = ""
})


const divPlantContent = document.getElementById('dropdown-plants')
const genusButton = document.getElementById('button-genera')
const plantButton =  document.getElementById('button-plant')
const plantCollection = document.querySelector(".plant-collection")
const main = document.querySelector(".main")
const container = document.querySelector(".container")
const filterGenus = document.querySelector(".filtered-genera")

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
     //add show to display the inner content of the drop down
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

//====================Home Page addEventListener to plant image ====================//
function indexPage(family){
  family.plants.forEach((plantObj) => {
    const plantCard = document.createElement("div")
    plantCard.dataset.id = `p${plantObj.id}`
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
        // hide is display: none is css
        fetch(`http://localhost:3000/plants/${plantObj.id}`)
        .then((resp) => {
          return resp.json()
        })
        .then((plant) => {
          soloDisplayOnDom(plant, plantCard)
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
//---------------Plant description --------------------------------
  const plantDesc = document.createElement("p")
  plantDesc.className = "desc"
  plantDesc.innerText = plant.description
  const desch2 = document.createElement("h2")
  desch2.innerText = "Description"
  const soloDiv = document.createElement("div")
  soloDiv.className = "name-desc-container"
  const editButton = document.createElement("button")
  editButton.innerText = "edit"
  editButton.className = "edit-delete"

//---------------Plant Loves --------------------------------

  const loves = document.createElement("div")
  loves.innerText = `${plant.loves} loves`

  const loveButton = document.createElement("img")
  loveButton.className = "love-button"
  loveButton.src =  "https://feea.org/wp-content/uploads/2018/05/fb-love-button.png"
//---------------Plant Care --------------------------------
  const careh2 = document.createElement("h2")
  careh2.innerText = "Care"
  const carePara = document.createElement("p")
  carePara.className = "desc"
  carePara.innerText = plant.care

//---------------backButton--------------------------------
  const backButton = document.createElement("button")
  backButton.className = "back-button"
  backButton.innerText = "back"


//--------------delete Button-----------------------------
  const deleteButton = document.createElement("button")
  deleteButton.className = "edit-delete"
  deleteButton.classList.add("delete")
  deleteButton.innerText = "delete"


  soloDiv.append(soloName, desch2, plantDesc, editButton, careh2, carePara, loves, loveButton)
  plantSoloCard.append(soloImage, soloDiv, backButton, deleteButton)
  container.append(plantSoloCard)

  goBackButton(backButton)
  editForm(editButton, plantDesc, plant)
  loveCounter(loveButton, plant, loves)
  deleteOnePlant(deleteButton, plant, plantSoloCard)


}//end of function


//--------------------Delete Plant from the SHOW PAGE -----------------------------------------//
function deleteOnePlant(deleteButton, plant, plantSoloCard){
  deleteButton.addEventListener("click", (evt) => {
      deleteFetch(plant.id)
      .then((response) => {
        plantSoloCard.remove()
        divId = "p" + response.plant.id
        const imageDiv = plantCollection.querySelector(`div[data-id="${divId}"]`)
        imageDiv.remove()
        plantCollection.classList.remove("hide")
    })
  })
}


function deleteFetch(plantId){
  return fetch(`http://localhost:3000/plants/${plantId}`, {
    method: "DELETE",
  })
    .then(resp => resp.json())
}
//--------------------------LOVES COUNTER --------------------------------//
function loveCounter(loveButton, plant, loves){
  loveButton.addEventListener("click", (evt) => {
    let loveCounter = parseInt(loves.innerText.split(" ")[0]) + 1
    fetch(`http://localhost:3000/plants/${plant.id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loves: loveCounter
      })
    })
    .then(resp => resp.json())
    .then((updatedPlant) => {
      loves.innerText =  parseInt(updatedPlant.loves) + " " + "loves"
    })
  }) // end of Lovebutton addEventListener
}

//--------------------EDIT Description -----------------------------------------//
function editForm(editButton, plantDesc, plant){
  editButton.addEventListener("click", (evt) => {
    // debugger
      if (editButton.disabled === false){
        const editForm = document.createElement("form");
        editForm.innerHTML = `<textarea rows="4" cols="50" type="text" name="description"
        placeholder= "edit this description...."></textarea><br>
        <input type="submit" value="Submit">`
        plantDesc.append(editForm)

        editForm.addEventListener("submit", (evt) => {
          evt.preventDefault()
          let newDesc = evt.target["description"].value

          fetch(`http://localhost:3000/plants/${plant.id}`, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
             description: newDesc
            })
          })
          .then(resp => resp.json())
          .then((updatedPlantObj) => {
            plantDesc.innerText = updatedPlantObj.description
            editButton.disabled = false;
          })
        })// end of edit form
        editButton.disabled = true;
      } // end of if
    })// end of edit button
  } // end of edit function

//--------------------Go Back to Index Page -----------------------------------------//
function goBackButton(backButton){
  backButton.addEventListener("click", (evt) => {
      plantCollection.classList.remove("hide")
      container.innerHTML = "";
  })
}

//====================genusName addEventListener ====================//
function familyNameOnDrp(family){
    const genusName = document.createElement("a")
    genusName.innerText = family.name
    divDropContent.append(genusName)
    genusName.addEventListener("click", (evt) => {
      plantCollection.classList.add("hide")
      let famObj = family
      let plantArray = famObj.plants
      filterGenus.innerHTML = ""
      plantArray.forEach((plantObject) => {
          filterGeneraCard(plantObject)
    })
  })
}


function filterGeneraCard(plantObject){
  const plantFilterCard = document.createElement("div")
  plantFilterCard.className = "filter-card"
  const filterImage = document.createElement("img")
  filterImage.className = "solo-img"
  filterImage.src = plantObject.image
  const filterName = document.createElement("h2")
  filterName.innerText = plantObject.name
  plantFilterCard.append(filterImage, filterName)
  filterGenus.append(plantFilterCard)
}

//====================plantName addEventListener ====================//
function plantNameOnDrp(family){
  family.plants.forEach((plantObj) => {
    const plantName = document.createElement("a")
    plantName.innerText = plantObj.name
    divPlantContent.appendChild(plantName)
  })
}
