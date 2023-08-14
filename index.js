const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const port = 3001
const bodyParser = require('body-parser');
const { log } = require('console')
app.use(bodyParser.json());

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get('/todos', (req,res) =>{
  fs.readFile('todos.json','utf-8',(err,data) => {
    if(err) throw err;
    res.json(JSON.parse(data));
  })
});

app.post('/todos',(req,res) => {
  let newTodo = {
    id : Math.ceil(Math.random() * 1000),
    task : req.body.task
  }
  fs.readFile('todos.json','utf-8',(err,data) => {
    if(err) throw err;
    let todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile('todos.json',JSON.stringify(todos),(err)=>{
      if(err) throw err;
      res.status(201).send(newTodo);
    })
  })
})

app.put('/todos/:id',(req,res) =>{
  fs.readFile('todos.json','utf-8',(err,data) => {
    if(err) throw err;
    let todos = JSON.parse(data);
    let ind = findIndex(todos,parseInt(req.params.id));
    if(ind === -1){
      res.status(404).send();
    }else{
      todos[ind].task = req.body.task;
      fs.writeFile('todos.json',JSON.stringify(todos),(err)=>{
        if(err) throw err;
        res.status(201).send("updated");
      })
    }
  })
})

app.delete('/todos/:id',(req,res) => {
  fs.readFile('todos.json','utf-8',(err,data) => {
    if(err) throw err;
    let todos = JSON.parse(data);
    let ind = findIndex(todos,parseInt(req.params.id));
    if(ind === -1){
      res.status(404).send();
    }
    else {
      todos = removeAtIndex(todos,ind);
      fs.writeFile('todos.json',JSON.stringify(todos),(err) =>{
        if(err) throw err;
        res.status(201).send(); 
      })
    }
  })
 
})
app.get('/main.css', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname,"main.css"));
});
app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"))
})
app.get('/main.js', (req, res) => {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname,"main.js"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})