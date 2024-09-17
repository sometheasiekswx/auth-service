import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    email: string;
    password: string;

    createdAt?: Date; // Optional because Mongoose handles this automatically
    updatedAt?: Date; // Optional because Mongoose handles this automatically

    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
    email: {type: String, unique: true, required: true}, password: {type: String, required: true},
}, {timestamps: true})

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        console.error(err);
        throw new Error("Failed to hash password");
    }
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;