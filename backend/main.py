from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class Todo(BaseModel):

    id: int
    title: str
    done: bool = False


todos: list[Todo] = []

@app.get("/todos", response_model=list[Todo])
def get_todos():
    return todos

@app.post("/todos", response_model=Todo)
def create_todo(todo: Todo):
    if todos:
        todo.id = max(item.id for item in todos) + 1
    else:
        todo.id = 1

    todos.append(todo)
    return todo

@app.get("/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id: int):
    for todo in todos:
        if todo.id == todo_id:
            return todo

    raise HTTPException(status_code=404, detail="Todo not found")
    

@app.patch("/todos/{todo_id}", response_model=Todo)
def mark_todo_done(todo_id: int):
    for todo in todos:
        if todo.id == todo_id:
            todo.done = True
            return todo

    raise HTTPException(status_code=404, detail="Todo not found")


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    for index, todo in enumerate(todos):
        if todo.id == todo_id:
            todos.pop(index)
            return {"message": "Todo deleted"}

    raise HTTPException(status_code=404, detail="Todo not found")

