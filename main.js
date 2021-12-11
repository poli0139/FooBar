"use strict";

window.addEventListener("DOMContentLoaded", form);
let darkmode = false;

//form
function form() {
  const form = document.querySelector(".login-form");
  const username = document.getElementById("Username");
  const password = document.getElementById("Password");
  const message = document.querySelector(".message");
  const header = document.querySelector("header");

  header.style.display = "none";

  const error = (input, message) => {
    input.nextElementSibling.classList.add("error");
    input.nextElementSibling.textContent = message;
  };

  const succes = (input) => {
    input.nextElementSibling.classList.remove("error");
  };
  const checkRequiredFields = (inputArr) => {
    inputArr.forEach((input) => {
      if (input.value.trim() === "") {
        error(input, `${input.id} is required`);
      }
    });
  };

  const checkName = (input) => {
    if (input.value === "Jonas") {
      succes(input);
      init();
    } else if (input.value === "Peter") {
      succes(input);
      init();
    } else if (input.value === "Klaus") {
      succes(input);
      init();
    } else if (input.value === "Dannie") {
      succes(input);
      init();
    } else {
      error(input, `${input.id} is wrong`);
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkName(username);
    checkRequiredFields([username, password]);
  });
}
// end of form

//loading animation

function init() {
  const nameBartender = document.querySelector(".name");
  const nameValue = document.getElementById("Username").value;
  nameBartender.innerHTML = nameValue;

  const screen1 = document.querySelector(".screen1");
  const loader = document.querySelector(".loader");
  const main = document.querySelector(".main");
  const header = document.querySelector("header");
  const body = document.querySelector("body");
  const logo2 = document.querySelector(".logo2 img");
  screen1.style.display = "none";
  logo2.style.display = "flex";
  logo2.style.visibility = "visible";
  loader.style.display = "flex";
  loader.style.visibility = "visible";
  body.style.borderLeft = "0";

  setTimeout(() => {
    const nameBartender2 = document.querySelector(".name2");
    const nameValue2 = document.getElementById("Username").value;
    nameBartender2.innerHTML = nameValue2;
    loader.style.display = "none";
    loader.style.visibility = "hidden";
    main.style.display = "grid";
    header.style.display = "flex";
    document.querySelector("body").style.borderLeft = "none";
  }, 3000);

  loadJSON();
}
//end of loading animation

//fetching data
function loadJSON() {
  fetch("https://foobarpm.herokuapp.com/")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);

      // refresh();
    });
}

//end of fetching data

//refresh data

//   const screen1 = document.querySelector(".screen1");
//   const loader = document.querySelector(".loader");
//   const main = document.querySelector(".main");

// setTimeout(function(){
//   location.reload(1);
//   loader.style.display = "none";
//   loader.style.visibility = "hidden";
//   main.style.display = "grid";
// }, 10000)};

//end of referesh data

function prepareObjects(jsonData) {
  showBeerTap(jsonData.taps);
  showQueue(jsonData.queue);
  showStorage(jsonData.storage);
  showTask(jsonData);
  convertTime(jsonData.timestamp);
}

//dipaly data
function convertTime(time) {
  const hour2 = new Date(time).getHours();
  const minutes2 = new Date(time).getMinutes().toString().padStart(2, "0");
  document.querySelector("header h1").textContent = hour2 + ":" + minutes2;
}

//BEER TAPS
function showBeerTap(taps) {
  const template = document.querySelector(".tapBeerTemplate").content;
  taps.forEach((tap) => {
    let percentage = (tap.level * 100) / tap.capacity + "%";

    const copy = template.cloneNode(true);
    copy.querySelector(".namebeer").textContent = tap.beer;
    let fill = copy.querySelector(".progress-fill");
    let filltext = copy.querySelector(".progress-text");
    let dot = copy.querySelector(".dot");
    if (tap.inUse === true) {
      dot.classList.remove("greendot");

      dot.classList.add("reddot");
    } else {
      dot.classList.remove("reddot");
      dot.classList.add("greendot");
    }
    filltext.textContent = percentage;

    const screen = {
      small: window.matchMedia("(min-width: 400px)"),
      medium: window.matchMedia("(min-width: 575px)"),
      large: window.matchMedia("(min-width:800px)"),
    };

    for (let [scr, mq] of Object.entries(screen)) {
      if (mq) mq.addEventListener("change", mqHandler);
    }
    function mqHandler() {
      let size = null;
      for (let [scr, mq] of Object.entries(screen)) {
        if (!mq || mq.matches) size = scr;
      }

      console.log(size);
      if (size === "large") {
        fill.style.height = percentage;
        fill.style.width = "100%";
      } else if (size === "medium") {
        fill.style.height = percentage;
        fill.style.width = "100%";
      } else {
        fill.style.width = percentage;
        fill.style.height = "100%";
      }
    }

    const mobileView = window.matchMedia("(max-width: 575px)");
    if (mobileView.matches) {
      fill.style.width = percentage;
      fill.style.height = "100%";
    } else {
      fill.style.height = percentage;
      fill.style.width = "100%";
    }

    createBubbles(60, 100);
    function createBubbles(bubblesNumber, percent) {
      for (let i = 0; i < bubblesNumber; i++) {
        const random = Math.floor(Math.random() * ((percent * 200) / 100));

        const bubble1 = document.createElement("div");
        bubble1.className = "bubble1";
        bubble1.style.left = random + "px";
        bubble1.style.opacity = random + "%";
        bubble1.style.animationDelay = Math.random() * 2 + "s";
        copy.querySelector(".bubbles1").appendChild(bubble1);
      }
    }
    document.querySelector(".bottomtaps").appendChild(copy);
  });
}

//NEXT IN QUEUE
function showQueue(peopleQueue) {
  const template = document.querySelector(".nextInQueueTemplate").content;
  peopleQueue.forEach((person) => {
    const copy = template.cloneNode(true);
    const hour = new Date(person.startTime).getHours();
    const minutes = new Date(person.startTime).getMinutes().toString().padStart(2, "0");

    copy.querySelector(".length").textContent = person.order.length;
    copy.querySelector(".orderId span").textContent = person.id;
    copy.querySelector(".orderTime").textContent = hour + ":" + minutes;
    document.querySelector(".people-queue").appendChild(copy);
  });
}

//STORAGE
function showStorage(storage) {
  const template = document.querySelector(".storageTemplate").content;
  storage.forEach((beer) => {
    const copy = template.cloneNode(true);
    copy.querySelector(".namebeer").textContent = beer.name;
    copy.querySelector(".amountbeer").textContent = `x${beer.amount}`;
    document.querySelector(".storageitems ul").appendChild(copy);
  });
}

//TASK
function showTask(dataBase) {
  const loggedIn = document.getElementById("Username").value;
  const workingBartender = dataBase.bartenders.filter((x) => x.name === loggedIn);
  const servings = dataBase.serving;
  const OrderToDo = workingBartender[0].servingCustomer;
  const container = document.querySelector(".task");
  const container2 = document.querySelector(".time-button");
  const hour3 = new Date(servings.filter((x) => x.id === OrderToDo)[0].startTime).getHours();
  const minute3 = new Date(servings.filter((x) => x.id === OrderToDo)[0].startTime).getMinutes().toString().padStart(2, "0");

  container.querySelector(".subheading2 span").textContent = " " + `#${servings.filter((x) => x.id === OrderToDo)[0].id}`;
  container.querySelector(".name3").textContent = servings.filter((x) => x.id === OrderToDo)[0].order;
  container2.querySelector(".order-time").textContent = hour3 + ":" + minute3;
}



//   .filter((x) => x.id === OrderToDo)[0]
//   .order.forEach(() => {
//     const newItem = document.createElement("li");
//     newItem.setAttribute.class = servings.filter(
//       (x) => x.id === OrderToDo
//     )[0].id;
//     newItem.textContent = servings.filter((x) => x.id === OrderToDo)[0].order;
//     document.querySelector(".task ul").appendChild(newItem);
//     console.log(newItem);
//   });

//LOG OUT
document.querySelector(".logout").addEventListener("click", reset);
function reset() {
  location.reload();
}

//end of display data

//DARK MODE

const modeSwitch = document.querySelector(".switch");
const switchDark = document.querySelector(".screen1 .switch");

switchDark.onclick = function () {
  if (darkmode === false) {
    darkmode = true;
    document.querySelector("body").classList.add("dark");
    document.querySelector("body").style.borderLeft = "7vw solid #849478";
    document.querySelector(".screen1").classList.add("dark");
    document.querySelector(".screen1 .switch").src = "assets/FooBar-switch2.png";
    document.querySelector(".logo3 img").src = "assets/logo-yellow.png";

    document.querySelector(".loader").classList.add("dark");
    document.querySelector(".logo2 img").src = "assets/logo-yellow.png";
  } else {
    darkmode = false;
    document.querySelector("body").classList.remove("dark");
    document.querySelector("body").style.borderLeft = "7vw solid #fcce72";
    document.querySelector(".screen1").classList.remove("dark");
    document.querySelector(".screen1 .switch").src = "assets/FooBar-switch.png";
    document.querySelector(".logo3 img").src = "assets/logo-green.png";

    document.querySelector(".loader").classList.remove("dark");
    document.querySelector(".logo2 img").src = "assets/logo-green.png";
  }
};

modeSwitch.onclick = function () {
  if (darkmode == false) {
    darkmode = true;
    console.log(darkmode);
    document.querySelector("body").classList.add("dark");
    document.querySelector(".bartender-img").src = "assets/bartender-yellow.png";
    document.querySelector(".switch").src = "assets/FooBar-switch2.png";
    document.querySelector(".logo").src = "assets/logo-yellow.png";
    document.querySelectorAll(".next-icon").forEach((element) => {
      element.src = "assets/next_yellow.png";
    });
    document.querySelector(".exit img").src = "assets/exit_white.png";
  } else {
    darkmode = false;
    document.querySelector("body").classList.remove("dark");
    document.querySelector(".bartender-img").src = "assets/bartender-green.png";
    document.querySelector(".switch").src = "assets/FooBar-switch.png";
    document.querySelector(".logo").src = "assets/logo-green.png";
    document.querySelectorAll(".next-icon").forEach((element) => {
      element.src = "assets/next_light-green.png";
    });
    document.querySelector(".exit img").src = "assets/exit_grey.png";
  }
};
//end of dark mode
