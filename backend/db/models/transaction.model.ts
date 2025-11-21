import mongoose, { Schema, Document, Model } from 'mongoose'
import { TRANSACTION_TYPE } from '../../helpers/common/constants';
import Counter from './counter.model'
import { toJSON, paginate } from './plugins';
import { TransactionFilterType } from '../dao/types';
import { PaginationOptionType, PaginationReturnType } from '../../controllers/types';

export interface ITransaction extends Document {
    _id: number,
    chainId: number,
    tokenId: string,
    tx: string,
    token0: string,
    token1: string,
    txType: string,
    amount0: string,
    amount1: string,
    usd: string,
    from: string,
    createdAt: Date,
    updatedAt:Date
}

interface TransactionQueryHelper extends Model<ITransaction> {
  paginate(filter: TransactionFilterType, options: PaginationOptionType): Promise<PaginationReturnType>
}

const transactionSchema = new Schema<ITransaction, TransactionQueryHelper>({
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
        default: undefined
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
      type: String,
      required: [true, 'amount0 is required']
    },
    amount1: {
      type: String,
      required: [true, 'amount1 is required']
    },
    usd: {
      type: String,
      required: [true, 'usd is required']
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
transactionSchema.plugin(paginate)

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

const Transaction = mongoose.model<ITransaction, TransactionQueryHelper>('Transaction', transactionSchema)

export default Transaction