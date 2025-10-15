/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type PasswordHashInput = {
  password: string;
};

export type IPasswordHashDoc = {
  passwordChangeAt?: Date;
  correctPassword(password: string): Promise<boolean>;
  passwordChangeAfter(JWTTimestamp: string): boolean;
} & PasswordHashInput &
  Document;

/**
 *  passwordHashPlugin
 * @param {Schema} schema - Mongoose schema
 * @throws {Error} If the schema is not an instance of mongoose Schema
 * @description This plugin hashes the password before saving the document and adds a method to compare the password and check if the password is changed after JWT issued
 * @example
 * // Add the plugin to a schema
 * schema.plugin(passwordHashPlugin);
 * // Compare the password
 * account.correctPassword(password);
 * // Check if password is changed after JWT issued
 * account.passwordChangeAfter(JWTTimestamp);
 */

const passwordHashPlugin = <T extends IPasswordHashDoc>(
  schema: Schema<T>,
): void => {
  const passwordHashSchema = new Schema<IPasswordHashDoc>({
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangeAt: {
      type: Date,
    },
  });
  schema.add(passwordHashSchema);

  // Pre-save hook that hashes the password
  schema.pre("save", async function (next) {
    const account = this as T;
    if (!this.isModified("password")) return void next();
    account.password = await bcrypt.hash(account.password, 12);
    next();
  });

  // Pre-save hook that adds passwordChangeAt when password is changed
  schema.pre("save", function (next) {
    const account = this as T;
    if (!this.isModified("password") || this.isNew) return void next();
    account.passwordChangeAt = new Date();
    next();
  });

  // Method to check if the password is correct
  schema.methods.correctPassword = async function (
    password: string,
  ): Promise<boolean> {
    const account = this as T;
    return await bcrypt.compare(password, account.password);
  };

  // Method to check if password is changed after JWT was issued
  schema.methods.passwordChangeAfter = function (
    JWTTimestamp: number,
  ): boolean {
    const account = this as T;
    if (account.passwordChangeAt) {
      const passwordChangeTimestamp = parseInt(
        (account.passwordChangeAt.getTime() / 1000).toString(),
        10,
      );
      return passwordChangeTimestamp > JWTTimestamp;
    }

    return false;
  };
};

export { passwordHashPlugin };
