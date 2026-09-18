# общие настройки для всех окружений 

from datetime import timedelta
from pathlib import Path


import environ


# 3 папы потому что три уровня вверх(по папкам)
BASE_DIR = Path(__file__).resolve().parent.parent.parent 

env = environ.Env()
if (BASE_DIR / ".env").exists():
    environ.Env.read_env(str(BASE_DIR / ".env"))