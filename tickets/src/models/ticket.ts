import { Document, Model, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties that are requires to create a new Ticker
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the property that tickets document has
interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;
}

// An interface that describe the properties that a user Model has
interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      // if an order is in progress this field have a value and if it have a value then its not-editable
      type: String,
    },
  },
  {
    toJSON: {
      // this will transform the return result of the user schema doc is the mongoose document and the ret is the plain JS object if we made some changes in the ret then it will reflect to the final result
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version'); // setting the "__v" to "version"
ticketSchema.plugin(updateIfCurrentPlugin);

// when we called the new User() for creating the user we are not able to type-check thats why we build this build() and add it to userSchema.
// the entire goal is to just allowed typescript to do some validation or type checking on the properties that we are trying to use to create the new record.
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
