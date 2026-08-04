import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer

logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"

async def consume_login_events():
    consumer = AIOKafkaConsumer(
        "login_success",
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="fastapi-blog-group",
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    )
    await consumer.start()
    
    while not consumer.assignment():
        await asyncio.sleep(0.1)
        
    # 2. Rewind all assigned partitions to offset 0
    await consumer.seek_to_beginning()
    logger.info("[Kafka Consumer] Offset reset to beginning.")

    try:
        async for msg in consumer:
            data = msg.value
            print('Message received from Kafka:', data)
    except asyncio.CancelledError:
        logger.info("[Kafka Consumer] Shutting down...")
    finally:
        await consumer.stop()

async def start_consumers() -> list[asyncio.Task]:
    """Spawns all app consumers as asynchronous background tasks."""
    tasks = [
        asyncio.create_task(consume_login_events()),
    ]
    return tasks