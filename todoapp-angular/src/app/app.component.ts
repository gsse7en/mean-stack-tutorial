import { Response } from '@angular/http';
import { TodoService } from './services/todo.service';
import ToDo from './models/todo.model';
import { Component, OnInit } from '@angular/core';

class Cell {
  //_id: string;
  name: string;
  color: string;
  isEditing: boolean;

  constructor(name = "", color = "gray"){
    this.name = name;
    this.color = color;
    this.isEditing = false;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public productNames:string[] = ["1","2","3","4","5"];
  //TODO: make 4 classes for buttons
  //ifClicked show 3 colors


  public productTable: Cell[] = [];
  constructor(
    //Private todoservice will be injected into the component by Angular Dependency Injector
    private todoService: TodoService
  ) { }

  //Declaring the new todo Object and initilizing it
  public newTodo: ToDo = new ToDo()

  //An Empty list for the visible todo list
  todosList: ToDo[];
  editTodos: ToDo[] = [];

  ngOnInit(): void {

    for (let i=0, length = this.productNames.length; i < length; i++) {
      for (let j=0; j < length; j++) {
        this.productTable.push(new Cell(`${i}-${j}`));
      }
    }
    //At component initialization the
    this.todoService.getToDos()
      .subscribe(todos => {
        //assign the todolist property to the proper http response
        this.todosList = todos
        console.log(todos)
      })
  }

  getCell(name) {
    return this.productTable.find((cell) => cell.name === name);
  }
  editCell(name) {
    console.log(name);
    this.productTable.map((cell) => {
      console.log(cell);
      if (cell.name === name) {
        cell.isEditing = true;
      }
      return cell;
    });
    console.log(this.productTable);
  }
  goodMix(name) {
    const cell = this.getCell(name);
    cell.color = "green";
    cell.isEditing = false;
  }
  normMix(name) {
    const cell = this.getCell(name);
    cell.color = "gray";
    cell.isEditing = false;
  }
  badMix(name) {
    const cell = this.getCell(name);
    cell.color = "red";
    cell.isEditing = false;
  }
  editTodo(todo: ToDo) {
    console.log(todo)
    if(this.todosList.includes(todo)){
      if(!this.editTodos.includes(todo)){
        this.editTodos.push(todo)
      }else{
        this.editTodos.splice(this.editTodos.indexOf(todo), 1)
        this.todoService.editTodo(todo).subscribe(res => {
          console.log('Update Succesful')
        }, err => {
          this.editTodo(todo)
          console.error('Update Unsuccesful')
        })
      }
    }
  }

  doneTodo(todo:ToDo){
    todo.status = 'Done'
    this.todoService.editTodo(todo).subscribe(res => {
      console.log('Update Succesful')
    }, err => {
      this.editTodo(todo)
      console.error('Update Unsuccesful')
    })
  }

  submitTodo(event, todo:ToDo){
    if(event.keyCode ==13){
      this.editTodo(todo)
    }
  }

  deleteTodo(todo: ToDo) {
    this.todoService.deleteTodo(todo._id).subscribe(res => {
      this.todosList.splice(this.todosList.indexOf(todo), 1);
    })
  }

  //This method will get called on Create button event

  create() {
    this.todoService.createTodo(this.newTodo)
      .subscribe((res) => {
        this.todosList.push(res.data)
        this.newTodo = new ToDo()
      })
  }
}
