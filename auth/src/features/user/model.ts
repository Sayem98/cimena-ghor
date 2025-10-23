import { Schema, model, Document, Model } from "mongoose";
import {
  passwordHashPlugin,
  PasswordHashInput,
  IPasswordHashDoc,
} from "../../plugins/password-hash.plugin";
import { builderPlugin, IBuilderModel } from "../../plugins/builder.plugin";
import {
  softDeletePlugin,
  ISoftDeleteDoc,
  ISoftDeleteModel,
} from "../../plugins/soft-delete.plugin";
import { USER_ROLES } from "./constant";
import { ObjectId } from "../../types";

export type IUserAttrs = {
  username: string;
  email: string;
} & PasswordHashInput;

export type IUserDoc = {
  id: ObjectId;
  role: USER_ROLES;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
} & Document &
  IPasswordHashDoc &
  ISoftDeleteDoc &
  IUserAttrs;

type IUserModel = {} & Model<IUserDoc> &
  IBuilderModel<IUserAttrs, IUserDoc> &
  ISoftDeleteModel<IUserDoc>;

const userSchema = new Schema<IUserDoc>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    isTwoFactorEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

userSchema.plugin(passwordHashPlugin);
userSchema.plugin(builderPlugin);
userSchema.plugin(softDeletePlugin);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const User = model<IUserDoc, IUserModel>("User", userSchema);
