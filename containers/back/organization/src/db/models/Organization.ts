import mongoose from "mongoose";
import { ProfileDoc } from "./Profile";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to create a new Organization
interface OrganizationAttrs {
  profile: ProfileDoc;
  title: string;
  website?: string;
  createdAt: number;
  updatedAt?: number;
}

// An interface that describes the properties
// that a Organization Model has
interface OrganizationModel extends mongoose.Model<OrganizationDoc> {
  build(attrs: OrganizationAttrs): OrganizationDoc;
}

// An interface that describes the properties
// that a single Organization Document has
export interface OrganizationDoc extends mongoose.Document {
  profile: ProfileDoc;
  title: string;
  website: string;
  createdAt: number;
  updatedAt?: number;
}

const OrganizationSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
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
  }
);

OrganizationSchema.set("versionKey", "version");
OrganizationSchema.plugin(updateIfCurrentPlugin);

// Add findByEvent method to a OrganizationSchema
OrganizationSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Organization.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add build method to a OrganizationSchema
OrganizationSchema.statics.build = (attrs: OrganizationAttrs) => {
  return new Organization(attrs);
};

const Organization = mongoose.model<OrganizationDoc, OrganizationModel>(
  "Organization",
  OrganizationSchema
);

export { Organization };
