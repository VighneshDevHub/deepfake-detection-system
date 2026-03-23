# backend/app/core/logging.py

import logging
import sys


def setup_logging(debug: bool = False) -> None:
    level = logging.DEBUG if debug else logging.INFO

    logging.basicConfig(
        level=level,
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
    )
    # Silence noisy libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("python_multipart").setLevel(logging.WARNING)  # ← add
    logging.getLogger("multipart").setLevel(logging.WARNING)          # ← add



def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)