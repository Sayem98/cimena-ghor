/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  Schema,
  Document,
  Model,
  PaginateModel,
  PaginateResult,
  UpdateWriteOpResult,
  Query,
  FilterQuery,
  PaginateOptions,
  RootFilterQuery,
  ProjectionType,
  QueryOptions,
  MongooseUpdateQueryOptions,
} from "mongoose";
import { UpdateOptions } from "mongodb";
import mongoosePaginate from "mongoose-paginate-v2";

// Define an interface for soft delete document
export type ISoftDeleteDoc = {
  deleteMarker: {
    status: boolean;
    deletedAt: Date | null;
  };
} & Document;

// Define the interface for the model with soft delete methods
export type ISoftDeleteModel<T extends ISoftDeleteDoc> = {
  softDelete(
    filter?: RootFilterQuery<T>,
    options?: (UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
  ): Promise<{ deleted: number }>;
  restore(
    filter?: RootFilterQuery<T>,
    options?: (UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
  ): Promise<{ restored: number }>;
  paginateAndExcludeDeleted(
    query?: FilterQuery<T>,
    options?: PaginateOptions,
  ): Promise<PaginateResult<T>>;
  findOneWithExcludeDeleted(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Query<T | null, T>;
} & Model<T> &
  PaginateModel<T>;
/**
 *  softDeletePlugin
 * @param {Schema} schema - Mongoose schema
 * @throws {Error} If the schema is not an instance of mongoose Schema
 * @description This plugin adds soft delete functionality to the schema with pagination support
 * @example
 * // Add the plugin to a schema
 * schema.plugin(softDeletePlugin);
 * // Soft delete documents
 * Model.softDelete(query);
 * // Restore soft deleted documents
 * Model.restore(query);
 * // Find documents with out soft deleted documents
 * Model.paginateAndExcludeDeleted(query, options);
 * // Find one document with out soft deleted documents
 * Model.findOneWithExcludeDeleted(query);
 */
export const softDeletePlugin = <T extends ISoftDeleteDoc>(
  schema: Schema<T>,
): void => {
  if (!(schema instanceof Schema))
    throw new Error("The schema must be an instance of mongoose schema");

  const softDeleteSchema = new Schema<ISoftDeleteDoc>({
    deleteMarker: {
      status: {
        type: Boolean,
        default: false,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
    },
  });
  schema.add(softDeleteSchema);
  schema.plugin(mongoosePaginate);

  // Static method to soft delete documents
  schema.static(
    "softDelete",
    async function (
      filter?: RootFilterQuery<T>,
      options?: (UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
    ) {
      try {
        const result = (await this.updateMany(
          {
            ...filter,
            "deleteMarker.status": false,
          },
          {
            $set: {
              "deleteMarker.status": true,
              "deleteMarker.deletedAt": new Date(),
            },
          },
          options,
        )) as UpdateWriteOpResult;

        return { deleted: result.modifiedCount || 0 };
      } catch (err: any) {
        throw new Error(err.name + ": " + err.message);
      }
    },
  );

  // Static method to restore soft deleted documents
  schema.static(
    "restore",
    async function (
      filter?: RootFilterQuery<T>,
      options?: (UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
    ) {
      try {
        const result = (await this.updateMany(
          {
            ...filter,
            "deleteMarker.status": true,
          },
          {
            $set: {
              "deleteMarker.status": false,
              "deleteMarker.deletedAt": null,
            },
          },
          options,
        )) as UpdateWriteOpResult;

        return { restored: result.modifiedCount || 0 };
      } catch (err: any) {
        throw new Error(err.name + ": " + err.message);
      }
    },
  );

  // Static method to find with out soft deleted documents
  schema.static(
    "paginateAndExcludeDeleted",
    async function (query?: FilterQuery<T>, options?: PaginateOptions) {
      const self = this as ISoftDeleteModel<T>;
      return self.paginate({ ...query, "deleteMarker.status": false }, options);
    },
  );

  // Static method to find not deleted document
  schema.static(
    "findOneWithExcludeDeleted",
    function (
      filter: RootFilterQuery<T>,
      projection?: ProjectionType<T> | null,
      options?: QueryOptions<T> | null,
    ) {
      const self = this as ISoftDeleteModel<T>;
      return self.findOne(
        { ...filter, "deleteMarker.status": false },
        projection,
        options,
      );
    },
  );
};
