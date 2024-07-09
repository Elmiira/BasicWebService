import { Module } from '@nestjs/common';
import { resolvers } from './resolvers';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    StoreModule
],
  providers: [...resolvers]
})
export class GraphqlModule {}
