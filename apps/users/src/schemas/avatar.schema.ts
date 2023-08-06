import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class Avatar extends AbstractDocument {
  @Prop({unique: true})
  userId: number;

  @Prop()
  avatar: string;

  @Prop()
  location: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
