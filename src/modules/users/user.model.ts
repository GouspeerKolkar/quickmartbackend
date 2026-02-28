import mongoose, { Schema, model, models, HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  ADMIN = "ADMIN",
  SUPPORT = "SUPPORT",
  CUSTOMER = "CUSTOMER",
  SELLER_OWNER = "SELLER_OWNER",
  SELLER_STAFF = "SELLER_STAFF",
  DELIVERY_PARTNER = "DELIVERY_PARTNER",
}

/** subdocs */
export interface Address {
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface NotificationPrefs {
  push: boolean;
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

/** main user fields */
export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;

  phone?: string;
  avatar?: string;

  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;

  addresses: Address[];

  fcmTokens: string[];
  notificationPreferences: NotificationPrefs;
}

/** instance methods */
export interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

/** document type used inside hooks/methods */
export type UserDoc = HydratedDocument<IUser, UserMethods>;

const AddressSchema = new Schema<Address>(
  {
    label: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

const NotificationPrefsSchema = new Schema<NotificationPrefs>(
  {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
  },
  { _id: false },
);

const UserSchema = new Schema<
  IUser,
  mongoose.Model<IUser, {}, UserMethods>,
  UserMethods
>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },

    phone: { type: String, trim: true },
    avatar: { type: String, trim: true },

    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },

    addresses: { type: [AddressSchema], default: [] },

    fcmTokens: { type: [String], default: [] },
    notificationPreferences: {
      type: NotificationPrefsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

/** ✅ pre save hook (typed `this`) */
UserSchema.pre("save", async function () {
  const u = this as UserDoc;

  if (u.isModified("addresses")) {
    let found = false;
    for (const a of u.addresses || []) {
      if (a.isDefault && !found) found = true;
      else if (a.isDefault && found) a.isDefault = false;
    }
  }

  if (u.isModified("passwordHash")) {
    u.passwordHash = await bcrypt.hash(u.passwordHash, 12);
  }
});

/** ✅ typed instance method */
UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

export const User =
  (models.User as mongoose.Model<IUser, {}, UserMethods>) ||
  model<IUser, mongoose.Model<IUser, {}, UserMethods>>("User", UserSchema);
