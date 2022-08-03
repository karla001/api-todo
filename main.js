
function getAll(){
    axios.get("https://api.vschool.io/scrimbalessons/todo")
        .then(response=>{
            response.data.forEach(item => {
                display(item);
            });
        })
        .catch(err=>console.log(err))
} 

function getOne(id){
    axios.get(`https://api.vschool.io/scrimbalessons/todo/${id}`)
        .then(response=>console.log(response.data))
        .catch(err=>console.log(err))
}

function deleteOne(id){
    axios.delete(`https://api.vschool.io/scrimbalessons/todo/${id}`)
        .then(response=>console.log(response.data))
        .catch(err=>console.log(err))
}

function createOne(todo){
    axios.post("https://api.vschool.io/scrimbalessons/todo", todo)
        .then(res=>{
            console.log(res.data)
            clearForm()
            getAll()
        })
        .catch(err=>err)
}

function editOne(todo){
    console.log(todo, '??')
    axios.put(`https://api.vschool.io/scrimbalessons/todo/${todo._id}`, todo)
        .then(res=>console.log(res.data))
        .catch(err=>err)
}

getAll();

const todoForm = document.todoForm;

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

const checkboxes = document.checkboxes;
checkboxes.addEventListener('change', (checked)=>{
    checked.preventDefault()
    let item = checked.target.parentNode.value;
    if(item.completed){
        item.completed = false;
        checked.target.parentNode.style = "text-decoration: none";
    }else{
        item.completed = true;
        checked.target.parentNode.style = "text-decoration: line-through";
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

function createAndAppend(newElement, elemenToBeAppendedTo ){

}

function display(item){

    const listItem = document.createElement('h1');
    listItem.textContent = `${item.title}: \n ${item.description}`;
    listItem.value = item;
    listItem.id = item._id;

    const exitButton = document.createElement('button');
    exitButton.textContent = "X";
    exitButton.value = item._id;
    exitButton.className = "exit";
    exitButton.onclick = item=>{remove(item.target.value)};
    listItem.appendChild(exitButton)

    const checkInput = document.createElement('input');
    checkInput.type= `checkbox`;
    checkInput.className = "checkboxes";
    listItem.appendChild(checkInput)

    if(item.completed){
        listItem.style = "text-decoration: line-through";
        checkInput.checked = true;
    }

    if(item.imgUrl){
        const img = document.createElement('img');
        img.src = `${item.imgUrl}`;
        img.style = "height: 200px; width 200px;display: block";
        listItem.appendChild(img)
    }

    const editButton = document.createElement('button');
    editButton.textContent = "Edit";
    editButton.value = item._id;
    editButton.className = "edit";
    editButton.onclick = item=>{editItem(item)};
    listItem.appendChild(editButton)
    document.getElementById('todo').appendChild( listItem);
}

// Prevents the getForm function from grabbing a blank item 
async function editItem(item){
    item.preventDefault()
    getForm(item)
}

function getForm(item){
    let info = item.target.parentNode.value;
    let newListItem = item.target.parentNode;

    newListItem.textContent = "";

    let title = document.createElement('input')
    title.type = 'text';
    title.id = "title";
    title.value = info.title;
    title.className ="editInput";

    let todoDescription = document.createElement('input')
    todoDescription.type = 'text';
    todoDescription.id = "todo";
    todoDescription.className ="editInput";
    todoDescription.value = info.description;

    newListItem.appendChild(title)
    newListItem.appendChild(todoDescription)

    let editButton = document.createElement('button');
    editButton.className = "edit";
    editButton.onclick = event=>saveEditedItem(event, newListItem.value,title.value, todoDescription.value );
    editButton.textContent = "Save";

    newListItem.appendChild(editButton)
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
