import mongoose, { Schema } from 'mongoose'
import Counter from './counter.model'
import toJSON from './plugins/toJSON.plugin'

interface IUser {
    _id: number,
    name: string,
    profile: string,
    address: string,
    intro?: string,
    loginTime?: Date,
    logoutTime?: Date
}

const userSchema = new Schema<IUser>({
    _id: { type: Number,  min: 1 },
    name: {
        type: String,
        trim: true,
        unique: true,
        minLength: [5, 'name should have at least 5 characters'],
        maxLength: [20, 'name should have at most 20 characters'], 
        required: [true, 'name is required'],
    },
    profile: {
        type: String,
        default: 'profile__0.png',
        required: [true, 'profile is required'],
    },
    address: {
        type: String,
        index: true,
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                var re = /^0x[a-fA-F0-9]{40}$/;
                return re.test(v)
            },
            message: props => `${props.value} is invalid cryptocurrency wallet address`
        },
        required: [true, 'address is invalid'],
    },
    intro: {
        type: String,
        trim: true,
        maxLength: [200, 'intro should be less than 200 characters']
    },
    loginTime: {type: Date},
    logoutTime: {type: Date},
}, { timestamps: true })
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.plugin(toJSON)

userSchema.pre('save', async function (next) {
    if (!this.isNew) {
      next();
      return;
    }
    
    try {
      const seq = await Counter.increment('userId')
      this._id = seq
      next()
    } catch(err: any) {
      next(err)
    }   
});
/**
 * plugins
/**
 * Methods
 */
/**
 * Statics
 */

/**
 * Register
 */
const User = mongoose.model<IUser>('User', userSchema)

export default User