import mongoose, {
Schema,
Document,
} from "mongoose";

export interface ICategory
extends Document {

name: string;

color: string;

user?: mongoose.Types.ObjectId;

isDefault: boolean;
}

const categorySchema =
new Schema<ICategory>(
{
name: {
type: String,
required: true,
trim: true,
},

  color: {
    type: String,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
}

);

categorySchema.index({
user: 1,
name: 1,
});

export default mongoose.model<ICategory>(
"Category",
categorySchema
);