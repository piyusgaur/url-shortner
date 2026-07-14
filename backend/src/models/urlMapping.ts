import { Schema, model } from "mongoose";

export interface UrlMappingDocument {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const urlMappingSchema = new Schema<UrlMappingDocument>(
  {
    originalUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UrlMapping = model<UrlMappingDocument>("UrlMapping", urlMappingSchema);
