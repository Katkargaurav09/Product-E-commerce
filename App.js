let article = document.querySelector(".sub-products");

let product = async () => {
  let data = await window.fetch("http://localhost:3000/products");
  let fData = await data.json();
  try {
    fData.map((v, i) => {
      let div = document.createElement("div");
      div.classList.add("div-container-products");
      let { id, title, description, price, rating, thumbnail } = v;
      div.innerHTML = `
        <figure>
        <img src=${thumbnail} alt=${id} >
        </figure>
        <aside class="aa1">
        <p> ${title.slice(0, 25) + "..."} </p>
        <p> <b>Description :</b> ${description.slice(0, 25) + "..."}</p>
        </aside>
        <aside class="aa2">
        <p> Price : ₹${price} </p>
        <p> ★ : ${rating} </p>
        </aside>
        <aside class="aa3">
        <button onclick="handleCart(event,${id})">Add to cart</button>
        </aside>
        `;
      article.appendChild(div);
    });
  } catch (error) {
    console.log(error);
  }
};

product();

let signUpData = document.querySelector(".reg-form");
let loginData = document.querySelector(".login-form");
let loginBtn = document.querySelector(".login");
let signupBtn = document.querySelector(".signup");

loginBtn.addEventListener("click", (e) => {
  loginData.style.display = "flex";
  signUpData.style.display = "none";
});

signupBtn.addEventListener("click", (e) => {
  signUpData.style.display = "flex";
  loginData.style.display = "none";
});

signUpData.addEventListener("submit", fetchDataFn);

function fetchDataFn(e) {
  e.preventDefault();
  let formDataMain = Object.fromEntries(new FormData(signUpData));
  if (formDataMain.password == formDataMain.cPassword) {
    Swal.fire({
      title: "Account Created Successfully",
      icon: "success",
      showConfirmButton: true,
      timer: 5000,
    });
    setTimeout(() => {
      window.fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application.json" },
        body: JSON.stringify(formDataMain),
      });
    }, 2000);
  } else {
    Swal.fire({
      title: "Password and confirm password doesn't match",
      icon: "warning",
      showConfirmButton: false,
      timer: 3000,
    });
  }
}

let handleCart = async (e, id) => {
  let d = await window.fetch(`http://localhost:3000/products/${id}`);
  let fD = await d.json();
  let cartData = window.fetch("http://localhost:3000/cart", {
    method: "POST",
    headers: { "Content-Type": "application.json" },
    body: JSON.stringify(fD),
  });
};

// login form

loginData.addEventListener("submit", checkDataFn);
let sup = document.querySelector(".sup");
let list = document.querySelector(".list1");

let cartItemList = document.querySelector(".list-of-cart-items");

function checkDataFn(e) {
  e.preventDefault();
  let loginDataMain = Object.fromEntries(new FormData(loginData));
  console.log(loginDataMain);
  window.fetch("http://localhost:3000/users").then(
    (d) => {
      d.json().then(
        (v) => {
          let res = v.some((v, i) => {
            return (
              v.username == loginDataMain.username &&
              v.password == loginDataMain.password
            );
          });
          if (res) {
            Swal.fire({
              title: "Loggened Sucessfully",
              text: `Welcome ${loginDataMain.username}, To E-commerce website`,
              icon: "success",
              showConfirmButton: false,
              timer: 3000,
            });
            scrollTo(0, 0);
            sup.innerHTML = `${loginDataMain.username}`;
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.innerHTML = "Log out";
            li.appendChild(a);
            list.appendChild(li);
            a.addEventListener("click", (e) => {
              sup.innerHTML = "Signup";
              list.removeChild(li);
              window.location.reload();
            });
            window.fetch("http://localhost:3000/cart").then(
              (d) => {
                d.json().then(
                  (v) => {
                    v.map((v, i) => {
                      let { thumbnail, title, price, id } = v;
                      cartItemList.innerHTML += `
                      <div class="cart-container-list">
                      <aside class="a1">
                      <img src="${thumbnail}" alt="${id}">
                      </aside>
                      <aside class="a2">
                      <p>Title : ${title}</p>
                      <p>Price : ${price}</p>
                      <p>Count : </p>
                      </aside>
                      </div>
                      `;
                    });
                    let totalPrice = 0;
                    v.forEach((v) => {
                      totalPrice += v.price * v.quantity;
                    });
                    console.log(totalPrice);
                  },
                  (e) => {
                    console.log(e);
                  }
                );
              },
              (e) => {
                console.log(e);
              }
            );
          } else {
            Swal.fire({
              title: "Username and Password doesn't match",
              icon: "warning",
              showConfirmButton: false,
              timer: 3000,
            });
          }
        },
        (e) => {
          console.log(e);
        }
      );
    },
    (e) => {
      console.log(e);
    }
  );
}

let cart = document.querySelector(".fa-cart-shopping");
let cartContainer = document.querySelector(".cart-container");
let cancel = document.querySelector(".fa-x");

cart.addEventListener("click", (e) => {
  cartContainer.style.display = "block";
});

cancel.addEventListener("click", (e) => {
  cartContainer.style.display = "none";
});
