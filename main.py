from fastapi import FastAPI
from database import  engine
from models import Base
from fastapi.middleware.cors import CORSMiddleware
from crud import router as crud_router


app = FastAPI()

Base.metadata.create_all(bind=engine) # is code se database bana hai 


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # sabhi origins ko allow karo
    allow_methods=["*"],  # sabhi HTTP methods ko allow karo
    allow_credentials=True,  # credentials ko allow karo
    allow_headers=["*"],  # sabhi headers ko allow karo
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the TODO API"}

# crud_router ko main.py me include karna hai taki crud.py ke sare endpoints(API) main.py me available ho jaye
app.include_router(crud_router, prefix="/todo", tags=["Crud Router"])







