const divDropContent = document.getElementById('dropdown-genera')
const genusAll = document.createElement("a")
genusAll.className = "all"
genusAll.innerText = "all";
divDropContent.appendChild(genusAll)
genusAll.addEventListener("click", (evt) => {
  plantCollection.classList.remove("hide")
  filterGenus.innerHTML = ""
  createButton.classList.remove("hide")
  formDiv.innerHTML = ""
})

let famArr = [];

const divDrop = document.querySelector(".dropdown")


const createButton = document.querySelector(".formbtn") //create plants
const formDiv = document.querySelector(".form-container")
const genusButton = document.getElementById('button-genera') //genus button on index page
const plantCollection = document.querySelector(".plant-collection") //home page with all plants
const main = document.querySelector(".main")
const soloContainer = document.querySelector(".container")
const filterGenus = document.querySelector(".filtered-genera")
//-----------------------First Fetch------------------------------------------------//
fetch("http://localhost:3000/families")
.then((resp) => {
  return resp.json()
})
.then((familyArray) => {
  famArr = familyArray
  familyArray.forEach((family) => {
    familyNameOnDrp(family)
    indexPage(family)
  })
//------------------Genus Name ------------------------------------------------//
  genusButton.addEventListener("click", (evt) => {
//line 17 can be rewritten as evt.target.nextElementSibling.className.includes("show")
    if (divDropContent.className.includes("show")){
     divDropContent.classList.remove("show")
   } else {
     divDropContent.classList.add("show")
     //add show to display the inner content of the drop down
   }
 }) // end of addEventListener
})  // end of first fetch

//---------------------Create Form  for ONE PLANT--------------------------------------------//
 createButton.addEventListener("click", (evt) => {
   formDiv.classList.remove("hide")
  plantCollection.classList.add("hide")
  const form = document.createElement("form")
  form.className = "form"
  const inputName = document.createElement("input")
  const br = document.createElement("br")
  const label1 = document.createElement("label")
  label1.for = "lname"
  label1.innerText = "Plant Name: "
  inputName.type = "text"
  inputName.name = "lname"
  inputName.placeholder= "plant name.."

  const br1 = document.createElement("br")
  const inputDesc = document.createElement("textarea")
  inputDesc.style.height = "200px"
  inputDesc.style.width = "200px"
  const label2 = document.createElement("label")
  label2.for = "desc"
  label2.innerText = "Description: "
  inputDesc.type = "text"
  inputDesc.name = "desc"
  inputDesc.placeholder= "plant desc.."

  const br2 = document.createElement("br")
  const inputCare = document.createElement("textarea")
  const label3 = document.createElement("label")
  label3.for = "care"
  label3.innerText = "Care: "
  inputCare.type = "text"
  inputCare.name = "care"
  inputCare.placeholder= "plant care.."

  const br3 = document.createElement("br")
  const inputImage = document.createElement("input")
  const label4 = document.createElement("label")
  label4.for = "image"
  label4.innerText = "Img-url: "
  inputImage.type = "text"
  inputImage.name = "image"
  inputImage.placeholder= "Image url.."

  const br4 = document.createElement("br")
  const selectFamily = document.createElement("select")
  const label5 = document.createElement("label")
  label5.for = "select"
  label5.innerText = "Genus: "
  const inputSubmit = document.createElement("input")
  inputSubmit.type = "submit";
  inputSubmit.value = "submit";
  form.append(label4, inputImage, br, label1, inputName, br1, label2, inputDesc, br2, label3, inputCare, br3, label5, selectFamily, br4, inputSubmit)

  famArr.forEach((famObj) => {
    const option = document.createElement("option")
    option.value = famObj.id
    option.innerText = famObj.name
    selectFamily.appendChild(option)
  })
  formDiv.innerHTML = ""
  formDiv.append(form)

  form.addEventListener("submit", (evt) => {
    evt.preventDefault()

    let newPlantName = evt.target["lname"].value
    let newPlantDesc = evt.target["desc"].value
    let newPlantCare = evt.target["care"].value
    let newPlantImg = evt.target["image"].value
    let newPlantFamily = evt.target.querySelector("select").value

    fetch(`http://localhost:3000/plants`,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {
        name: newPlantName,
        description: newPlantDesc,
        loves: 0,
        care: newPlantCare,
        image: newPlantImg,
        family_id: newPlantFamily
      })
    })
    .then(resp => resp.json())
    .then((newPlant) => {
      plantCollection.classList.remove("hide")
      indexPagePlantCard(newPlant)
      form.innerHTML = ""
      formDiv.classList.add("hide")

    })
  }) // form addEventListener

}) //form button addEventListener



// evt.target.querySelector("select").value



//====================Home Page addEventListener to plant image ================/
function indexPage(family){
  family.plants.forEach((plantObj) => {
      indexPagePlantCard(plantObj)
  })//end of forEach
}// end of indexPage

function indexPagePlantCard(plantObj){
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

  if (plantImg){
      plantImg.addEventListener("click", (evt) => {
          plantCollection.classList.add("hide")
          genusButton.classList.add("hide")
          createButton.classList.add("hide")
          divDrop.classList.add("hide")
          // hide is display: none is css
          fetch(`http://localhost:3000/plants/${plantObj.id}`)
          .then((resp) => {
            return resp.json()
          })
          .then((plant) => {
            soloDisplayOnDom(plant, plantCard)


          })
        })// end of addEventListener
      }// end of if
}



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
  loveButton.src ="https://feea.org/wp-content/uploads/2018/05/fb-love-button.png"
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

  //----------name button ---------------------------------
  const nameButton = document.createElement("button")
  nameButton.innerText = "name"

  soloDiv.append(soloName, desch2, plantDesc, editButton, careh2, carePara, loves, loveButton
  )
  plantSoloCard.append(soloImage, soloDiv, backButton, deleteButton)
  soloContainer.append(plantSoloCard)

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
        genusButton.classList.remove("hide")
        createButton.classList.remove("hide")
        divDrop.classList.remove("hide")
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

    if (loveCounter <= 50){
    fetch(`http://localhost:3000/plants/${plant.id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loves: loveCounter,
      })
    })
    .then(resp => resp.json())
    .then((updatedPlant) => {
      loves.innerText =  parseInt(updatedPlant.loves) + " " + "loves"

  })//end of second .then
} else {
    loveButton.src = `https://cdn2.iconfinder.com/data/icons/hearts-16/100/004-512.png`;
}
}) // end of Lovebutton addEventListener
}





//--------------------EDIT Description -----------------------------------------//
function editForm(editButton, plantDesc, plant){
  editButton.addEventListener("click", (evt) => {
    // debugger
      if (editButton.disabled === false){ //edit button working
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
      soloContainer.innerHTML = "";
        genusButton.classList.remove("hide")
        createButton.classList.remove("hide")
        divDrop.classList.remove("hide")
  })
}

//====================family name on drop genusName addEventListener ====================//
function familyNameOnDrp(family){
    const genusName = document.createElement("a")
    genusName.innerText = family.name
    divDropContent.append(genusName)

    genusName.addEventListener("click", (evt) => {
      plantCollection.classList.add("hide")
      let famObj = family
      let plantArray = famObj.plants
      filterGenus.innerHTML = ""
      createButton.classList.add("hide")
      formDiv.innerHTML = ""
      plantArray.forEach((plantObject) => {
          filterGeneraCard(plantObject)
    })
  })
}

//-----------------FILTER PLANTS BY GENUS NAME---------------------------
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

  plantFilterCard.addEventListener("click", (evt) => {
        genusButton.classList.add("hide")
        filterGenus.innerHTML = ""
        divDrop.classList.add("hide")
        soloDisplayOnDom(plantObject)
  })




}
