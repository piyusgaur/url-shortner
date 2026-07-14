import { Schema, model } from "mongoose";

export interface UrlMappingDocument {
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  lastAccessedAt: Date | null;
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
    clickCount: {
      type: Number,
      required: true,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const UrlMapping = model<UrlMappingDocument>("UrlMapping", urlMappingSchema);
