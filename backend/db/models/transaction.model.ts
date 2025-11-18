import mongoose, { Schema, Document } from 'mongoose'
import { TRANSACTION_TYPE } from '../../helpers/common/constants';
import Counter from './counter.model'
import toJSON from './plugins/toJSON.plugin'

export interface ITransaction extends Document {
    _id: number,
    chainId: number,
    tokenId: string,
    tx: string,
    token0: string,
    token1: string,
    txType: string,
    amount0: number,
    amount1: number,
    usd: number,
    from: string,
    createdAt: Date,
    updatedAt:Date
}

const transactionSchema = new Schema<ITransaction>({
    _id: { type: Number,  min: 1 },
    chainId: {
        type: Number,
        min: [1, "chainId should be equal or greater than 1"],
        validate: {
            validator: function (v: number) {
                return v >= 1 && Number.isInteger(v);
            },
            message: props => `${props.value} should be a positive integer!`,
        },
        required: [true, 'chainId is required'],
    },
    tokenId: {
        type: String,
        required: [true, 'tokenId is required']
    },
    tx: {
        type: String,
        required: [true, 'tx is required']
    },
    token0: {
        type: String,
        trim: true,
        validate: {
          validator: function(v): boolean {
            const re = /^0x[a-fA-F0-9]{40}$/;
            return re.test(v);
          },
          message: props => `${props.value} is an invalid cryptocurrency address`
        },
        required: [true, 'token0 is required'],
    },
    token1: {
        type: String,
        trim: true,
        validate: {
          validator: function(v): boolean {
            const re = /^0x[a-fA-F0-9]{40}$/;
            return re.test(v);
          },
          message: props => `${props.value} is an invalid cryptocurrency address`
        },
        required: [true, 'token1 is required'],
    },
    txType: {
        type: String,
        enum: {
            values: Object.values(TRANSACTION_TYPE),
            message: '{VALUE} in txType not supported'
        },
        default: TRANSACTION_TYPE.Mint,
        require: [true, 'txType is required']
    },
    amount0: {
        type: Number,
        default: 0,
        min: [0, 'amount0 cannot be a negative number'],
    },
    amount1: {
        type: Number,
        default: 0,
        min: [0, 'amount1 cannot be a negative number'],
    },
    usd: {
        type: Number,
        default: 0,
        min: [0, 'usd cannot be a negative number'],
    },
    from: {
        type: String,
        trim: true,
        validate: {
          validator: function(v): boolean {
            const re = /^0x[a-fA-F0-9]{40}$/;
            return re.test(v);
          },
          message: props => `${props.value} is an invalid cryptocurrency address`
        },
        required: [true, 'from is required'],
    }
},{timestamps: true})

transactionSchema.plugin(toJSON)

transactionSchema.pre('save', async function (next) {
    if (!this.isNew) {
      next();
      return;
    }
    
    try {
      const seq = await Counter.increment('transaction')
      this._id = seq
      next()
    } catch(err: any) {
      next(err)
    }   
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema)

export default Transaction