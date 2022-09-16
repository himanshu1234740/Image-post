
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
let get_cookie = getCookie('jwt')
if (get_cookie) {
  

  if (localStorage.getItem("user")) {

    let user = JSON.parse(localStorage.getItem("user"))
    let first_letter = user.user;
    let uppercase = first_letter[0].toUpperCase();
    let remainStr = "";
    for (let i = 1; i < first_letter.length; i++) {
      remainStr += first_letter[i];
    }
    let sort = remainStr.slice(0, 11);
    document.getElementById("username").innerHTML = "My Account";
  
    document.getElementById("login_user").style.visibility = "hidden";
  
  }

}else {
  document.getElementById("username").style.visibility = "hidden";
}








function post() {
  let img = document.getElementById('email').files[0];
  let desc = document.getElementById('desc').value;
  let title = document.getElementById('title').value;

  let formdata = new FormData();

  formdata.append("img", img, img.filename);
  formdata.append("desc", desc);
  formdata.append("title", title)


  axios.post(`/api/users`, formdata).then(function (response) {


    window.location.href = '/';

  }).catch(function (error) {
    console.error(error);
  });
}
// here we are delete the post
function del(id) {

  const options = {
    method: 'DELETE',
    url: `api/users/${id}`,

  };

  axios.request(options).then(function (response) {
    window.location.href = '/';

  }).catch(function (error) {
    console.log(error);
  });
}

function update(id) {
  let img = document.getElementById("update_img").files[0];
  let desc = document.getElementById("update_desc").value;
  let title = document.getElementById("update_title").value;
  let formdata = new FormData();
  formdata.append("img", img, img.filename);
  formdata.append("desc", desc);
  formdata.append("title", title);


  axios.put(`api/users/${id}`, formdata).then(function (response) {
    // window.location.href = '/';
    console.log(response.data);

  }).catch(function (error) {
    console.error(error);
  });
}


// search functionality
let btn = document.getElementById('input');

function search() {
  let card = document.getElementsByClassName('col')
  let input = document.getElementById('input').value.toLowerCase();
  for (let i = 0; i < card.length; i++) {
    let val = card[i].getElementsByTagName('h5')[0].innerHTML.toLowerCase();
    if (val.indexOf(input) > -1) {
      card[i].style.display = "";
    } else {
      card[i].style.display = "none"
    }
  }
}

async function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  console.log(password, email)
  const { data } = await axios.post('/api/login', { email, password });
  console.log(data.password);
  localStorage.setItem("user", JSON.stringify(data));

  if (data === "invalid response") {
    swal("Oops!", "You Put Invalid Detail!", "error");
  } else if (data === "err") {
    swal("Oops!", "You Put Invalid Detail!", "error");
  }

  else {

    window.location.href = "/";
  }


}

async function register() {
  let user = document.getElementById("user").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let cpassword = document.getElementById("cpassword").value;
  let reg = /([!@#$%^&*0-9a-zA-Z]+){8,15}/;
  let regex = /^\w([\_\.0-9a-zA-Z]+)@([\_\.0-9a-zA-Z]+)\.([a-zA-z]){2,7}$/;
  if (reg.test(password)) {
    if (regex.test(email)) {
      const { data } = await axios.post('/api/register', { user, email, password, cpassword });

      localStorage.setItem("user", JSON.stringify(data));
      if (data === "password does not match") {
        swal("Oops!", "Your Password And Confirm Password Does Not Match!", "error");
      } else if (data === "Account Already Exists") {
        swal("Oops!", "Account Already Exists!", "error");
      } else {
        window.location.href = "/login";
      }
    } else {
      swal("Oops!", "Email Is Not Valid", "error");
    }
  } else {
    swal("Oops!", "Password Should Be Minimum 8 characters And Maximum 15 characters", "error");

  }
}

function update_profile(id) {
  let user = document.getElementById("user_profile").value;
  let email = document.getElementById("email_profile").value;
  let regex = /^\w([\_\.0-9a-zA-Z]+)@([\_\.0-9a-zA-Z]+)\.([a-zA-z]){2,7}$/;
  if (regex.test(email)) {
    axios.put(`api/login/${id}`, { user, email }).then(function (response) {
      if(response.data==="invalid"){
        swal("Oops!", "This Email is Already Exists You Can't Update'!", "error");
      }else{
        localStorage.setItem('name', response.data.user)
      
      window.location.href = "/";
      }
      
    }).catch(function (error) {
      console.log(error);
    })
  } else {
    swal("Oops!", "Email Is Not Valid", "error");
  }

}

function postemail() {
  const email = document.getElementById('emailpost').value;

  axios.post(`/api/forget`, { email }).then((response) => {
    if (response.data === "") {
      swal("Oops!", "This Email Address Are Not Register", "error");
    } else {
      localStorage.setItem('userloginId', response.data._id.toString());
      window.location.href = "/password";
    }

  }).catch((error) => {
    console.log(error);
  })
}
function updatePassword() {
  let password = document.getElementById("forgetpassword").value;
  let cpassword = document.getElementById("forgetcpassword").value;
  let id = localStorage.getItem('userloginId');
  let reg = /([!@#$%^&*0-9a-zA-Z]+){8,15}/;
  if (reg.test(password)) {
    axios.put(`/api/forget/${id}`, { password, cpassword }).then((data) => {
      if (data.data === 'notMatch') {
        swal("Oops!", "Your Password And Confirm Password Does Not Match!", "error");
      } else {
        window.location.href = '/login'
      }

    }).catch((error) => {
      console.log(error);
    })
  } else {
    swal("Oops!", "Password Should Be  8 characters", "error");
  }

}
