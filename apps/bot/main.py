import asyncio
import logging
import sys
import os

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.utils.markdown import hbold
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

TOKEN = os.getenv("BOT_TOKEN", "")
# Default fallback URL ensures the bot doesn't crash during early dev if url is missed.
# Must be HTTPS per Telegram requirements.
WEBAPP_URL = os.getenv("WEBAPP_URL", "") or "https://midas-platform-demo.vercel.app"

dp = Dispatcher()

@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    """
    This handler receives messages with `/start` command
    and provides the gateway access to the MIDAS Mini App.
    """
    welcome_text = (
        f"Salom, {hbold(message.from_user.full_name)}! 👋\n\n"
        "Xush kelibsiz! <b>MIDAS</b> — bu eng ilg'or reklama va media bozorida bizneslarni hamda "
        "kreatorlarni bog'lovchi premium platforma.\n\n"
        "Platformadan to'liq foydalanish, reklamalarni qidirish, portfolioni boshqarish va "
        "takliflar yuborish uchun quyidagi tugmani bosing va tizimga kiring:"
    )
    
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 MIDAS ni ochish",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ]
    )
    
    await message.answer(welcome_text, reply_markup=keyboard)

from aiogram.client.default import DefaultBotProperties

async def main() -> None:
    if not TOKEN:
        logging.error("BOT_TOKEN is not set in the environment variables.")
        sys.exit(1)
        
    bot = Bot(TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    logging.info("Starting MIDAS Telegram Bot...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
