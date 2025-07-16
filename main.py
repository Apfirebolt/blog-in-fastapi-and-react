from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import uvicorn
from starlette.staticfiles import StaticFiles

from auth import router as auth_router
from blog import router as blog_router

app = FastAPI(title="Fast API Blog",
    docs_url="/docs",
    version="0.0.1")

origins = ["http://localhost:3000",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Blog API in FastAPI"}


app.include_router(auth_router.router)
app.include_router(blog_router.router)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/media", StaticFiles(directory="media"), name="media")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)