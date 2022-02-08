function getApiData() {
  axios
  .get("https://infodev-server.herokuapp.com/api/todos")
  .then(function (res) {
    console.log("Got data")
    displayData(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
}
function postApiData(data) {
  axios({
    method: "post",
    url: "https://infodev-server.herokuapp.com/api/todos",
    data: data,
  })
    .then((res) => {
      console.log("Posted");
      getApiData();
    })
    .catch((err) => {
      console.log(err);
    });
}
function deleteApiData(id) {
  axios({
    method: "delete",
    url: `https://infodev-server.herokuapp.com/api/todos/${id}`,
  })
    .then((res) => {
      console.log("Deleted");
      getApiData();
    })
    .catch((err) => {
      console.log(err);
    });
}
function patchApiData(data, id) {
  axios({
    method: "put",
    url: `https://infodev-server.herokuapp.com/api/todos/${id}`,
    data: data,
  })
    .then((res) => {
      console.log("marked done")
      getApiData();
    })
    .catch((err) => {
      console.log(err);
    });
}
function updateApiData(data,id){
  axios({
    method: "put",
    url: `https://infodev-server.herokuapp.com/api/todos/${id}`,
    data: data,
  })
    .then((res) => {
      console.log('Updated');
      document.getElementById('add').style.display = 'block';
      document.getElementById('update').style.display = 'none';
      getApiData();
    })
    .catch((err) => {
      console.log(err);
    });
}

function displayData(data) {
  const ul = document.querySelector("#lecture-list ul");
  const ul1 = document.querySelector("#uncomplete-list ul");
  
  let lisArray1 = [];
  let lisArray2 = [];

  data.forEach((item) => {
    const li = document.createElement("li");
    li.id = item._id;
    let priority;
    let color;
    if (item.priority === 0) {
      priority = "low";
      color = "info";
    } else if (item.priority === 1) {
      priority = "medium";
      color = "warning";
    } else {
      priority = "high";
      color = "danger";
    }

    if (item.completed === true) {
      li.innerHTML = `<div>
    <h6 class="title completed">${item.name}<span class="ml-2 badge badge-${color}">${priority}</span></h6>
    <p class="description">${item.description}</p>
    </div>
    <div>
    <button class="btn btn-danger" onclick="deleteApi()"><i class="far fa-trash-alt"></i></button>
    </div>`;

    lisArray1.push(li);
    } else {
      li.innerHTML = `<div>
      <h6 class="title" id="${li.id}-name">${item.name}<span class="ml-2 badge badge-${color}" id="${li.id}-priority">${priority}</span></h6>
      <p class="description" id="${li.id}-description">${item.description}</p>
      </div>
      <div>
      <button class="btn btn-success"><i class="fas fa-check"></i></i></button>
      <button class="btn btn-warning"><i class="fas fa-pencil"></i></i></button>
      <button class="btn btn-danger" onclick="deleteApi()"><i class="far fa-trash-alt"></i></button>
      </div>`;

      lisArray2.push(li);
    }
  });

  ul.replaceChildren(...lisArray1);
  ul1.replaceChildren(...lisArray2);
}


document.addEventListener("DOMContentLoaded", () => {
  getApiData();
  document.getElementById("update").style.display = 'none';


  const form = document.forms["lecture-add"];
  let btn1 = document.getElementById('add');
  let btn2 = document.getElementById('update');
  const ul = document.querySelector("#uncomplete-list ul");

  //posting data
  if(btn1.id === 'add'){
    btn1.addEventListener("click", (event) => {
      event.preventDefault();
      let taskName = form.querySelector("input").value;
      let priority = form.querySelector("select").value;
      let description = form.querySelector("textarea").value;
      let getData = {
        name: taskName,
        priority: priority,
        description: description,
        completed: false,
      }
        postApiData(getData);
        form.querySelector("input").value = '';
        form.querySelector("select").value = 0;
        form.querySelector("textarea").value = '';
    });
  
    
  }

  
 /* //deleting data

  //querySelectorAll disables other ul
  ul.addEventListener("click", (event) => {
    let delId;
    if (event.target.classList[1] === "btn-danger") {
      delId = event.target.parentElement.parentElement;
      deleteApiData(delId.id);
    } else if (event.target.classList[1] === "fa-trash-alt") {
      delId = event.target.parentElement.parentElement.parentElement;
      deleteApiData(delId.id);
    }
  });
  */

  //task completed button
  ul.addEventListener("click", (event) => {
    if (event.target.classList[1] === "btn-success") {
      var taskId = event.target.parentElement.parentElement;
    } else if (event.target.classList[1] === "fa-check") {
      var taskId = event.target.parentElement.parentElement.parentElement;
    }
    let putData = {
      completed: true,
    };
    patchApiData(putData, taskId.id);
  });

  //updating data
  ul.addEventListener("click", (event) => {
    if (event.target.classList[1] === "btn-warning") {
      var updateid = event.target.parentElement.parentElement;
    }else if(event.target.classList[1] === 'fa-pencil'){
      var updateid = event.target.parentElement.parentElement.parentElement;
    }
    let updateName = document.getElementById(`${updateid}-name`).data;
    let description = document.getElementById(`${updateid}-description`).data;
    let updatePriority = document.getElementById(`${updateid}-priority`).data;
    console.log(updateName, description, updatePriority)
    let priority;
    if (updatePriority === "low") {
      priority = 0;
    } else if (updatePriority == "medium") {
      priority = 1;
    } else {
      priority = 2;
    }

    const form = document.forms["lecture-add"];
    form.querySelector("input").value = updateName;
    form.querySelector("textarea").value = description;
    form.querySelector("select").value = priority;
    
    document.getElementById('add').style.display = 'none';
    
    btn2.style.display = 'block';
    window.scrollTo(0, 0);

    if(btn2.id === 'update'){
      btn2.addEventListener("click", (event) => {
        event.preventDefault();
        let taskName = form.querySelector("input").value;
        let priority = form.querySelector("select").value;
        let description = form.querySelector("textarea").value;
        
          updateApiData({
            name: taskName,
            priority: priority,
            description: description,
            completed: false,
          },updateid.id);

          form.querySelector("input").value = '';
          form.querySelector("select").value = 0;
          form.querySelector("textarea").value = '';
      }); 
    }
  });
});


function deleteApi() {
  document.querySelectorAll('ul').forEach(item => {
    item.addEventListener('click', event => {
      let delId;
    if (event.target.classList[1] === "btn-danger") {
      delId = event.target.parentElement.parentElement;
      deleteApiData(delId.id);
      //console.log("top");
    } else if (event.target.classList[1] === "fa-trash-alt") {
      delId = event.target.parentElement.parentElement.parentElement;
      deleteApiData(delId.id);
      //console.log("bottom");
    }
    })
  })
}