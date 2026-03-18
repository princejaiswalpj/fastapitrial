from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_db
from sqlalchemy.orm import Session
from models import ToDo
from typing import List

router = APIRouter()

class TodoCreate(BaseModel):  # user data de sakta hai
    title: str
    description: str
    done: bool

class TodoResponse(TodoCreate):  # database se data aayega
    id: int


todos=[]

@router.get("/",response_model=List[TodoResponse])
def show(db: Session = Depends(get_db)):
    return db.query(ToDo).all()

@router.post("/", response_model=TodoResponse)
def creat_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    new_todo = ToDo(title=todo.title, description=todo.description, done=todo.done)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)  # update data lo database se
    return new_todo  # response bhj do client ko

@router.put("/{todo_id}",response_model=TodoResponse)
def update_todo(todo_id : int , todo : TodoCreate, db: Session = Depends(get_db)):
    db_todo = db.query(ToDo).filter(ToDo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.title = todo.title
    db_todo.description = todo.description
    db_todo.done = todo.done
    db.commit()
    db.refresh(db_todo)
    return db_todo
  

@router.delete('/{todo_id}')
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(ToDo).filter(ToDo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return {"delete ho gya"}


