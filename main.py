import asyncio
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from auth import router as auth_router
from blog import router as blog_router

# Import Kafka core components
from utils.kafka_consumer import start_consumers


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    #await init_producer()
    consumer_tasks = await start_consumers()
    print("Kafka consumers started successfully.")

    yield

    # --- Shutdown ---
    for task in consumer_tasks:
        task.cancel()
    await asyncio.gather(*consumer_tasks, return_exceptions=True)


app = FastAPI(
    title="Fast API Blog",
    docs_url="/docs",
    version="0.0.1",
    lifespan=lifespan,
)

origins = ["http://localhost:3000"]

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
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)