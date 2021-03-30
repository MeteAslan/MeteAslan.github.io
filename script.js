function productLoader() {
  fetch("Products.json")
    .then((res) => res.json())
    .then((products) => {
      let html = "";
      products.forEach((element, index) => {
        html = `
       <div id="product${index + 1}" class="card">
        <img id="product-img${index + 1}" src="img/${
          index + 1
        }.jpg" class="card-img-top img-fluid" alt="1">
          <div class="card-body">
          <h5 id="product-name${index + 1}" class="card-title">${
          element.productName
        }</h5>
          <div class="card-footer">
            <button id="buy${index + 1}" class="btn btn-primary">Buy</button>
            <span id="price${index + 1}" style="float:right; font-size: 30px">${
          element.productPrice
        }</span>
            </div>
           </div>
        </div> 
        `;
        document.querySelector("#card-list").innerHTML += html;
      });
    })
    .catch((err) => console.log(err));
}

window.load = productLoader();

// Side Bar Event //
const shopboxButton = document.querySelector("#shopbox-btn");
const container = document.querySelector("#container");
const cardList = document.querySelector("#card-list");
const closeElement = document.querySelector(".close");
const sidebar = document.querySelector(".sidebar");
const sideBarItems = document.querySelector("#sidebar-items");
const totalPrice = document.querySelector("#totalPrice");
const shoppingCartAlert = document.querySelector("#shoppingCartAlert");

shopboxButton.addEventListener("click", openNav);
closeElement.addEventListener("click", closeNav);

function openNav() {
  sidebar.classList.remove("closed");
  cardList.style.width = "80%";
  container.classList.add("flex");
}

function closeNav() {
  sidebar.classList.add("closed");
  container.classList.remove("flex");
  cardList.style.width = "100%";
}

// Buy Button Event & Counter(badge) Increment & add item to side bar//

let sidebarItemIds = []; // it holds side bar items ids
document.addEventListener("click", function (e) {
  const counter = document.querySelector("#item-counter");

  if (e.target.id.includes("buy")) {
    // badge //
    counter.style.display = "inline-block";
    let currentAmount = parseInt(counter.innerHTML);
    counter.innerHTML = currentAmount + 1;

    // Shopping Cart Alert Display Control //
    shoppingCartAlert.classList.replace("d-block", "d-none");

    // side bar items feature variable //
    let price = e.target.parentElement.lastElementChild.textContent;
    let name =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    let pic = e.target.parentElement.parentElement.parentElement.firstElementChild.src.split(
      "/"
    );

    let buyButtonNum = e.target.id.match(/\d+/)[0]; //parse number from clicked buy button id
    let idSideItems = "side" + buyButtonNum; //id creator for each side bar items)
    let itemAmount = "amount" + buyButtonNum; //id creator for amount of each side bar items
    //sidebar item increment and decrement buttons ids
    let amountEnhancerIds = {
      plus: "plus" + buyButtonNum,
      minus: "minus" + buyButtonNum,
    };

    let itemBarPriceId = "itemPrice" + buyButtonNum; // sidebar item price holder tag ids

    let sideBarContent = `
    <div id="${idSideItems}" class="card float-left side-card">
      <div class="row">
        <div class="col-sm-5">
        <img class="d-block w-100  h-100" src="img/${
          pic[pic.length - 1]
        }"></img>
        </div>
        <div class="col-sm-7">
          <div class="card-block">
              <h4>${name}</h4>
             <h5 id="${itemBarPriceId}"><strong>${price}</strong></h5> 
            
             <div class="amountControl">
             <i id="${
               amountEnhancerIds.plus
             }" class="fas fa-plus-circle fa-3x"></i>
             <span id="${itemAmount}" style="font-size: 200%" class="numberCircle ml-2">1</span>
             <i id="${
               amountEnhancerIds.minus
             }" class="fas fa-minus-circle fa-3x ml-2"></i>
            </div>
          
            </div>
        </div>
      </div>
    </div>
   `;

    // side bar items duplicate element control //
    if (sideBarItems.childElementCount == 0) {
      sideBarItems.innerHTML += sideBarContent;
      sidebarItemIds.push(idSideItems);
    } else {
      if (sidebarItemIds.indexOf(idSideItems) < 0) {
        sidebarItemIds.push(idSideItems);
        sideBarItems.innerHTML += sideBarContent;
      } else {
        /*increment control of an already existing element in the sidebar*/
        let currentItem = document.getElementById(itemAmount);
        let currentItemInıtıal = parseInt(currentItem.innerHTML);
        currentItem.textContent = currentItemInıtıal + 1;
      }
    }

    // Buy Button Event Price Update Control //
    priceUpdater(document.getElementById(itemAmount));

    // Total Amount Indıcator Display Control //
    totalPrice.classList.replace("d-none", "d-inline-flex");
  }

  // sidebar item plus minus icon event control //
  if (e.target.id.includes("plus")) {
    let amountHolderTag = e.target.nextElementSibling;
    let increment = parseInt(amountHolderTag.innerText) + 1;
    amountHolderTag.textContent = increment;
    counter.textContent = parseInt(counter.innerText) + 1; // badge counter update

    priceUpdater(amountHolderTag); //sidebar item plus icon event price update control
  }

  if (e.target.id.includes("minus")) {
    let amountHolderTag = e.target.previousElementSibling;
    let decrement = parseInt(amountHolderTag.innerText) - 1;
    amountHolderTag.innerText > 0
      ? (amountHolderTag.textContent = decrement)
      : false;

    counter.textContent = parseInt(counter.innerText) - 1; // badge counter update

    priceUpdater(amountHolderTag); //sidebar item minus icon event price update control

    // Delete item form sidebar Control
    if (amountHolderTag.innerText == 0) {
      let idNum = e.target.id.match(/\d+/)[0];
      let elemToDeleted = document.getElementById("side" + idNum);

      // sidebar remove update
      elemToDeleted.remove();

      // sidebarItemIds array update
      sidebarItemIds.splice(sidebarItemIds.indexOf(elemToDeleted.id), 1);

      if (sideBarItems.childElementCount == 0) {
        // Total Amount Indıcator Display Control //
        totalPrice.classList.replace("d-inline-flex", "d-none");

        // Shopping Cart Alert Display Control //
        shoppingCartAlert.classList.replace("d-none", "d-block");
      }
    }
  }

  if (e.target.id == "payButton") {
    alert("Thanks For Your Shopping");
  }
});

function priceUpdater(element) {
  let elemIdNumPart = element.id.match(/\d+/)[0];
  let articleId = "itemPrice" + elemIdNumPart;
  let article = document.getElementById(articleId).children[0];
  let productPrice = document.getElementById("price" + elemIdNumPart).innerText;
  let productPriceNum = parseFloat(productPrice.match(/(\d+\.\d{1,2})/g)[0]);
  
  let elementCurrentPrice = parseInt(element.innerText);

  let updatePriceVal = (productPriceNum * elementCurrentPrice).toFixed(2);

  article.textContent = "$" + updatePriceVal;

  // Total Amount Indıcator Value Update //
  let amountToBePaid = document.querySelector("#amountToBePaid");
  let sum = 0;
  if (sidebarItemIds.length > 0) {
    for (let i = 0; i < sidebarItemIds.length; i++) {
      let idNumParse = sidebarItemIds[i].match(/\d+/)[0];
      let everyItemPriceTag = document.getElementById("itemPrice" + idNumParse);
      let total = parseFloat(
        everyItemPriceTag.children[0].innerText.match(/(\d+\.\d{1,2})/g)[0]
      );
      sum += total;
    }
  }

  amountToBePaid.textContent = "$" + (sum.toFixed(2));
}
