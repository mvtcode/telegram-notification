import { isValidObjectId } from 'mongoose';
import { Message } from '../../dto/message.dto';
import { NotifierInterface } from '../../interface/notifier';
import { BaseDecorator } from '../../decorator/base.decorator';
import TelegramModel from './telegram.model';
import { TelegramEntity } from './telegram.dto';

const TelegramBot = require('node-telegram-bot-api');

const adminId = parseInt(process.env.TELEGRAM_ADMIN, 0);
const botUser = process.env.TELEGRAM_BOT_USERNAME;

export class TelegramNotification extends BaseDecorator {
  private bot: any;

  constructor(notifier: NotifierInterface) {
    super(notifier);
    this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
      polling: true,
    });
    this.bot.sendMessage(adminId, 'Service notification startup');
    this.handlerEvent();
  }

  send(message: Message): void {
    this.notifier.send(message);
    this.sendTelegram(message);
  }

  private async sendTelegram(message: Message): Promise<void> {
    this.logger.info(message);

    const list: TelegramEntity[] = await TelegramModel.find({
      isEnable: true,
    });

    if (list && list.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const tele of list) {
        this.bot.sendMessage(tele.chatId, message.content);
      }
    }
  }

  private handlerEvent() {
    this.bot.on('message', async (msg: any) => {
      this.logger.info(msg);
      const { text } = msg;
      const { chat } = msg;
      if(text === '/start' || msg.group_chat_created) {
        this.joinGroup(chat);
      }

      if (msg.new_chat_members) {
        const { new_chat_members: newChatMembers } = msg;
        if(newChatMembers.some((m: any) => m.username === botUser)) {
          this.joinGroup(chat);
        }
      }

      if (msg.left_chat_member && msg.left_chat_member.username === botUser) {
        await TelegramModel.deleteOne({
          chatId: chat.id,
        });
      }
    });

    this.bot.onText(/\/echo (.+)/, (msg: any, match: any) => {
      const chatId = msg.chat.id;
      const resp = match[1];
      this.logger.info(msg);
      this.bot.sendMessage(chatId, resp);
    });

    this.bot.onText(/\/send (\d+) (.+)/, (msg: any, match: any) => {
      const chatId = msg.chat.id;
      this.logger.info(msg.text, match);
      if(chatId !== adminId) {
        this.bot.sendMessage(chatId, 'You are not have permission');
        return;
      }
      this.bot.sendMessage(match[1], match[2]);
    });

    this.bot.onText(/\/list(.+)?/, async (msg: any) => {
      const { text } = msg;
      this.getList(msg, text.split(/ /g));
    });

    this.bot.onText(/\/detail (.+)/, async (msg: any, match: any) => {
      const chatId = msg.chat.id;
      this.logger.info(msg.text, match);
      if(chatId !== adminId) {
        this.bot.sendMessage(chatId, 'You are not have permission');
        return;
      }
      const id = match[1];
      if(!isValidObjectId(id)) {
        this.bot.sendMessage(chatId, 'Id is not valid type ObjectId');
      }
      const info = await TelegramModel.findById(id);
      this.bot.sendMessage(chatId, JSON.stringify(info));
    });

    this.bot.onText(/\/enable (.+)/, async (msg: any, match: any) => {
      const chatId = msg.chat.id;
      this.logger.info(msg.text, match);
      if(chatId !== adminId) {
        this.bot.sendMessage(chatId, 'You are not have permission');
        return;
      }
      const id = match[1];
      if(!isValidObjectId(id)) {
        this.bot.sendMessage(chatId, 'Id is not valid type ObjectId');
      }
      const info = await TelegramModel.findByIdAndUpdate(id, {
        $set: {
          isEnable: true,
        },
      }, {
        new: true,
      });

      if (!info) {
        this.bot.sendMessage(chatId, 'Item not exists');
      }
      this.bot.sendMessage(chatId, JSON.stringify(info));
    });

    this.bot.onText(/\/disable (.+)/, async (msg: any, match: any) => {
      const chatId = msg.chat.id;
      this.logger.info(msg.text, match);
      if(chatId !== adminId) {
        this.bot.sendMessage(chatId, 'You are not have permission');
        return;
      }
      const id = match[1];
      if(!isValidObjectId(id)) {
        this.bot.sendMessage(chatId, 'Id is not valid type ObjectId');
      }
      const info = await TelegramModel.findByIdAndUpdate(id, {
        $set: {
          isEnable: false,
        },
      }, {
        new: true,
      });

      if (!info) {
        this.bot.sendMessage(chatId, 'Item not exists');
      }
      this.bot.sendMessage(chatId, JSON.stringify(info));
    });
  }

  private async getList(msg: any, match: string[]) {
    const chatId = msg.chat.id;
    this.logger.info(chatId, msg.text, match);
    if(chatId !== adminId) {
      this.bot.sendMessage(chatId, 'You are not have permission');
      return;
    }

    const page = parseInt(match[1] || '0', 0);
    const limit = parseInt(match[2] || '20', 20);
    const where: any = {};
    if (match[3] && ['enable', 'disable'].includes(match[3])) {
      where.isEnable = match[3] === 'enable';
    }
    const list = await TelegramModel.find(where)
      .select({
        _id: 1,
        type: 1,
        isEnable: 1,
        username: 1,
        title: 1,
      })
      .limit(limit)
      .skip(page * limit)
      .sort({
        createdAt: -1,
      });
    const total = await TelegramModel.countDocuments(where);
    this.bot.sendMessage(chatId, `Total: ${total}\n${JSON.stringify(list)}`);
  }

  private joinGroup = async (chat: any) => {
    await TelegramModel.findOneAndUpdate({
      chatId: chat.id,
    }, {
      $set: {
        type: chat.type,
        firstName: chat.first_name || null,
        lastName: chat.last_name || null,
        username: chat.username || null,
        title: chat.title || null,
      },
    }, {
      new: true,
      upsert: true,
      timestamps: true,
      setDefaultsOnInsert: true,
    });
  };
}
