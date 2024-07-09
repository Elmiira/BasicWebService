import { Db, ObjectId } from 'mongodb';
import { InjectConnection } from '../mongo/index';
import { Injectable, Logger } from '@nestjs/common';
import { CreateDataDto, Status } from '../publisher/types';
import { IGetApiResponse, IData } from '../publisher/interfaces';

@Injectable()
export class StoreService {
  logger = new Logger();
  constructor(@InjectConnection() private readonly mongoConnection: Db) {}

  async addPayload({
    ts,
    sender,
    message,
    sent_from_ip,
    priority,
  }: CreateDataDto): Promise<boolean> {
    try {
      this.logger.log(
        `now is going to insert some data to the database`,
      );
      await this.mongoConnection.collection('data').insertOne({
        ts,
        sender,
        message,
        sent_from_ip,
        priority,
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async getAllPayloads(): Promise<IGetApiResponse> {
    try {
      const payloads = await this.mongoConnection
        .collection('data')
        .find({})
        .sort({ priority: 1 })
        .toArray();
  
      if (!payloads || payloads.length === 0) {
        return { status: Status.NotFound, res: 'Payload not found' };
      }
  
      const mappedPayloads: IData[] = payloads.map((payload) => ({
        _id: payload._id as ObjectId, // Ensure _id is cast to ObjectId
        ts: payload.ts,
        sender: payload.sender,
        message: payload.message,
        sentFromIp: payload.sentFromIp,
        priority: payload.priority
      }));
  
      return { status: Status.Successful, res: mappedPayloads };
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async getPayloadById(id: ObjectId): Promise<IGetApiResponse> {
    try {
      const payload = await this.mongoConnection
        .collection('data')
        .findOne({ _id: id });
  
      if (!payload) {
        return { status: Status.NotFound, res: 'Payload not found' };
      }
  
      const mappedPayload: IData = {
        _id: payload._id as ObjectId,
        ts: payload.ts,
        sender: payload.sender,
        message: payload.message,
        sentFromIp: payload.sentFromIp,
        priority: payload.priority
      };
  
      return { status: Status.Successful, res: [mappedPayload] };
    } catch (error) {
      return this.handleError(error); 
    }
  }

  // TODO: Move it to an Error Handler Middleware
  handleError(error: any): IGetApiResponse {
    this.logger.error(error);
    switch (error.message) { 
      case 'Invalid input data': 
        return { status: Status.BadRequest, res: error.message };
      default:
        return { status: Status.ServerUnavailable, res: error.message };
    }
  }
}
