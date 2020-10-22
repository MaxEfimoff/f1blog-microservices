import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  name: string;
  id: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a single User Document has
export interface UserDoc extends mongoose.Document {
  name: string;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Add build method to a UserSchema
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    name: attrs.name,
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
