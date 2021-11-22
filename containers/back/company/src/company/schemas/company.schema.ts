import * as mongoose from 'mongoose';
import { ProfileDoc } from './profile.schema';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new Company
interface CompanyAttrs {
  profile: ProfileDoc;
  title: string;
  website?: string;
  createdAt?: number;
  updatedAt?: number;
}

// An interface that describes the properties
// that a Company Model has
export interface CompanyModel extends mongoose.Model<CompanyDoc> {
  build(attrs: CompanyAttrs): CompanyDoc;
}

// An interface that describes the properties
// that a single Company Document has
export interface CompanyDoc extends mongoose.Document {
  profile: ProfileDoc;
  title: string;
  website: string;
  createdAt: number;
  updatedAt?: number;
  _id?: string;
}

export const CompanySchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
    title: {
      type: String,
      max: 120,
    },
    website: {
      type: String,
      max: 120,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
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
  },
);

CompanySchema.set('versionKey', 'version');
CompanySchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a CompanySchema
CompanySchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Company.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a CompanySchema
CompanySchema.statics.build = (attrs: CompanyAttrs) => {
  return new Company(attrs);
};

const Company = mongoose.model<CompanyDoc, CompanyModel>(
  'Company',
  CompanySchema,
);

export { Company };
