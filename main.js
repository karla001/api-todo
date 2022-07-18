
//get all
function getAll(){
    axios.get("https://api.vschool.io/scrimbalessons/todo")
        .then(response=>{
            response.data.forEach(item => {
                display(item);
            });
        })
        .catch(err=>console.log(err))
} 

//get one 
function getOne(id){
    axios.get(`https://api.vschool.io/scrimbalessons/todo/${id}`)
        .then(response=>console.log(response.data))
        .catch(err=>console.log(err))
}

//delete
function deleteOne(id){
    axios.delete(`https://api.vschool.io/scrimbalessons/todo/${id}`)
        .then(response=>console.log(response.data))
        .catch(err=>console.log(err))
}

//post one
function createOne(todo){
    axios.post("https://api.vschool.io/scrimbalessons/todo", todo)
        .then(res=>{
            console.log(res.data)
            clearForm()
            getAll()
        })
        .catch(err=>err)
}
//put one

function editOne(todo){
    console.log(todo, '??')
    axios.put(`https://api.vschool.io/scrimbalessons/todo/${todo._id}`, todo)
        .then(res=>console.log(res.data))
        .catch(err=>err)
}



// Get all items
getAll();
//get form 
const todoForm = document.todoForm;
//listen for form submit event
todoForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    var todo = {
        title: todoForm.title.value,
        description: todoForm.description.value,
        imgUrl: todoForm.imgUrl.value
    };
    clearList()
    createOne(todo);
})

//listen for checkbox change and updates completed status and style
const checkboxes = document.checkboxes;
checkboxes.addEventListener('change', (e)=>{
    e.preventDefault()
    let item = e.target.parentNode.value;
    if(item.completed){
        item.completed = false;
        e.target.parentNode.style = "text-decoration: none";
    }else{
        item.completed = true;
        e.target.parentNode.style = "text-decoration: line-through";
    }
    editOne(item)
})

function clearList(){
    let todolist = document.getElementById('todo');
    while( todolist.firstChild){
        todolist.removeChild(todolist.firstChild)
    }
}

function clearForm(){
    todoForm.title.value="";
    todoForm.description.value="";
    todoForm.imgUrl.value="";
}

//create and append items
function display(item){
    const h1 = document.createElement('h1');
    h1.textContent = `${item.title}: \n ${item.description}`;
    h1.value = item;
    h1.id = item._id;

    const x = document.createElement('button');
    x.textContent = "X";
    x.value = item._id;
    x.className = "exit";
    x.onclick = item=>{remove(item.target.value)};
    h1.appendChild(x)

    const check = document.createElement('input');
    check.type= `checkbox`;
    check.className = "checkboxes";
    h1.appendChild(check)
    if(item.completed){
        h1.style = "text-decoration: line-through";
        check.checked = true;
    }

    if(item.imgUrl){
        const img = document.createElement('img');
        img.src = `${item.imgUrl}`;
        img.style = "height: 200px; width 200px;display: block";
        h1.appendChild(img)
    }

    const editButton = document.createElement('button');
    editButton.textContent = "Edit";
    editButton.value = item._id;
    editButton.className = "edit";
    editButton.onclick = item=>{editItem(item)};
    h1.appendChild(editButton)
    document.getElementById('todo').appendChild(h1);
}
async function editItem(item){
    item.preventDefault()
    getForm(item)
}

function getForm(item){
    let info = item.target.parentNode.value;
    // let img = item.target.parentNode.children[2];
    // let checkbox = item.target.parentNode.children[1];
    // let editButton = item.target.parentNode.children[3];
    let h1 = item.target.parentNode;

    //clear h1
    h1.textContent = "";
    //create edit inputs and append
    let title = document.createElement('input')
    title.type = 'text';
    title.id = "title";
    title.value = info.title;
    title.className ="editInput";
    let todo = document.createElement('input')
    todo.type = 'text';
    todo.id = "todo";
    todo.className ="editInput";
    todo.value = info.description;
    h1.appendChild(title)
    h1.appendChild(todo)
    //edit button functinality and appending
    let editButton = document.createElement('button');
    editButton.className = "edit";
    editButton.onclick = e=>saveEditedItem(e, h1.value,title.value, todo.value );
    editButton.textContent = "Save";
    //append edit button
    h1.appendChild(editButton)
}

async function saveEditedItem(e, todo, newTitle, newDesciption){
    e.preventDefault()
    todo.title = newTitle;
    todo.description = newDesciption;
    console.log(todo) 
    await editOne(todo);
        clearList()
        getAll()
}

async function remove(id){
    await deleteOne(id);
    clearListOne(id);
}

function clearListOne(id){
    let item = document.getElementById(id);
    item.parentNode.removeChild(item)
}





//api is returning a completed == true todo item when updated