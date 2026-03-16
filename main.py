from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()

class Todo(BaseModel):
    id:int
    name:str
    description:str

todos=[]

@app.get("/")
def show():
    return todos

@app.post("/")
def creat_todo(todo:Todo):
    todos.append(todo)
    return {"successful"}

@app.put("/{todo_id}")
def update_todo(todo_id : int , updated_todo : Todo):
    for i,todo in enumerate(todos):
        if todo.id==todo_id:
            todos[i]=updated_todo
            return {"updated"}
    return {"not updated"}

@app.delete('/{todo_id}')
def delete_todo(todo_id: int):
    global todos
    todos = [todo for todo in todos if todo.id != todo_id]
    return {"delete ho gya"}

