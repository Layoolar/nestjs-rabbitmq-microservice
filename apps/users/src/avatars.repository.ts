import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Avatar } from './schemas/avatar.schema'; // Import the Avatar schema

@Injectable()
export class AvatarsRepository extends AbstractRepository<Avatar> {
  protected readonly logger = new Logger(AvatarsRepository.name);

  constructor(
    @InjectModel(Avatar.name) avatarModel: Model<Avatar>, 
    @InjectConnection() connection: Connection,
  ) {
    super(avatarModel, connection);
  }
}
