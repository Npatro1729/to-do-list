const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const list_el = document.querySelector("#tasks");

function todoFrontend(data){
    const task_el = document.createElement("div");
    task_el.classList.add("task");

    const task_content_el = document.createElement("div");
    task_content_el.classList.add("content");

    task_el.appendChild(task_content_el);
    const task_input_el = document.createElement("input");
    task_input_el.classList.add("text");
    task_input_el.setAttribute('id','texts');
    task_input_el.type = "text";
    task_input_el.value=data.task;
    task_input_el.setAttribute('readonly','readonly');
    task_content_el.appendChild(task_input_el);

    const task_actions_el = document.createElement("div"); 
    task_actions_el.classList.add("actions");

    const task_edit_el= document.createElement("button");
    task_edit_el.classList.add("edit");
    task_edit_el.innerHTML="edit";
    // task_edit_el.setAttribute("onClick" , "updatetodo(" + data.id +")");

    const task_delete_el = document.createElement("button");
    task_delete_el.classList.add("delete");
    task_delete_el.innerHTML="delete";
    task_delete_el.setAttribute("onClick" , "deletetodo(" + data.id +")");
    

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_el.appendChild(task_actions_el);
    list_el.appendChild(task_el);

    input.value = "";
task_edit_el.addEventListener('click' , () => {
if(task_edit_el.innerText.toLowerCase() == "edit"){
task_input_el.removeAttribute('readonly');
task_input_el.focus();
task_edit_el.innerText="save";
}else {
task_input_el.setAttribute("readonly","readonly");
task_edit_el.innerText="edit";
}
});
task_delete_el.addEventListener('click' , () =>{
list_el.removeChild(task_el);
});
}

function deletetodo(id){
    fetch("http://localhost:3001/todos/" + `${id}`,
        {
            method : "DELETE"
        }).then();
}
// function updatetodo(id){
//     const task = document.getElementById("texts").value;
//     console.log(task);
//     fetch("http://localhost:3001/todos/" + `${id}`,
//         {
//             method : "PUT" ,
//             body: JSON.stringify({
//                 task : task
//             }),
//             headers : {
//                 "content-type" : "application/json"
//             }
//         }).then()
// }


window.addEventListener('load' ,() => {
    function getData(){
        fetch("http://localhost:3001/todos",
        {method : "GET",
        }
        ).then( (resp) => {
            resp.json().then((data) => {
                for(let i = 0 ; i < data.length ; i++){
                    todoFrontend(data[i]);
            }  
            });
        })
    }
    getData();
    form.addEventListener('submit' ,(e) => {
        e.preventDefault();

        const task = document.getElementById('new-task-input').value;
        if(!task) {
            alert("plese fill out the task");
            return;
        }
        fetch("http://localhost:3001/todos",{
            method : "POST",
            body: JSON.stringify({
                task : task
            }),
            headers : {
                "content-type" : "application/json"
            }
        }).then((resp) => {
            resp.json().then((data) => {
               todoFrontend(data);
            })
        })
    });
});