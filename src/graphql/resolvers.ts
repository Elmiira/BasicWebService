
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb'; 
import { StoreService } from '../store/store.service';
import { CreateDataDto, Status } from '../publisher/types/index';
import { IData } from '../publisher/interfaces';


@Resolver('Payload') 
export class PayloadResolver {
  private readonly logger = new Logger('EliPayloadResolver'); // Provide a context name

  constructor(private readonly storeService: StoreService) {}

 
  @Query('getAllPayloads')
  async getAllPayloads() {
    const response = await this.storeService.getAllPayloads();
    // TODO: needs a code cleanup!
    if (response.status === Status.Successful) {
      this.logger.log(`Retrieved payloads: ${JSON.stringify(response.res)}`);
      return response.res;
    } 
    return null;
  }

  @Query('getPayloadById')
  async getPayloadById(@Args('id') id: string) {
    const response = await this.storeService.getPayloadById(new ObjectId(id));
    if (response.status === Status.Successful && typeof(response.res[0]) != "string") {
      this.logger.log(`Retrieved payloads: ${JSON.stringify(response.res)}`);
      // TODO: needs a code cleanup!
      const payload: IData = response.res[0];
      return {
        _id: payload._id.toString(), 
        ts: payload.ts,
        sender: payload.sender,
        message: payload.message,
        sent_from_ip: payload.sentFromIp,
        priority: payload.priority,
      };
    } 
    return null;
  }

  @Mutation('addPayload')
  async addPayload(@Args() createDataDto: CreateDataDto ) { 
    this.logger.log(
      `graphql mutation : ${createDataDto}`,
    );
    return this.storeService.addPayload(createDataDto);
  }

}

export const resolvers = [PayloadResolver]; 
