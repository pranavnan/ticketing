import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties that are requires to create a new User
// the properties that are used to create a user or create a record
interface UserAttrs {
  email: string;
  password: string;
}

// the reason we created the above and below interface is because the properties that are required to create an user might be different than the properties that actually end up on an user

// An interface that describes the property that user document has
// describes all the properties that a saved document has
interface UserDoc extends Document {
  email: string;
  password: string;
}

// An interface that describe the properties that a user Model has
// describes all the properties that the overall model it has and model represents the overall collection (its like a table in mysql world)
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // this will transform the return result of the user schema doc is the mongoose document and the ret is the plain JS object if we made some changes in the ret then it will reflect to the final result
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// this pre function is going to run before the document gets save in our mongoDb
userSchema.pre('save', async function (done) {
  // if in future, we are tying to edit the email this pre function is definetely run so at that time we dont need to re-hash the password. So while creating a new user we are passing the email and password at that time this password field is considered as modified.
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

// when we called the new User() for creating the user we are not able to type-check thats why we build this build() and add it to userSchema.
// the entire goal is to just allowed typescript to do some validation or type checking on the properties that we are trying to use to create the new record.
// This statics object is how we add a new method directly to the User model itself
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };
