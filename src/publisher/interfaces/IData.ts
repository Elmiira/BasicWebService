import { ObjectId } from 'mongodb';

export interface IData {
  _id:  ObjectId;
  ts: string;
  sender: string;
  message: IMessage;
  sentFromIp: string;
  priority: number;
}

export interface IMessage {
  foo: string;
  baz: string;
}
