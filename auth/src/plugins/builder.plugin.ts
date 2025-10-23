import { Model, Schema } from "mongoose";

export type IBuilderModel<Attrs, Doc> = {
  build(attrs: Attrs): Doc;
} & Model<Doc>;

/**
 *  builderPlugin
 * @param {Schema} schema - Mongoose schema
 * @throws {Error} If the schema is not an instance of mongoose Schema
 * @description This plugin add a build method to the schema to create a new document
 * @example
 * // Add the plugin to a schema
 * schema.plugin(builderPlugin);
 * // Create a new document
 * Model.build(account);
 */

const builderPlugin = <T>(schema: Schema<T>): void => {
  schema.statics.build = function (attrs: T) {
    return new this(attrs);
  };
};

export { builderPlugin };
