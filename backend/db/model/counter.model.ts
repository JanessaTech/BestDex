import mongoose, {Schema, Model} from 'mongoose'

interface ICounter {
    _id: string,
    seq: number
}
interface CounterModel extends Model<ICounter> {
    increment(counterName: string): Promise<number>
}

const counterSchema = new Schema<ICounter, CounterModel>(
    {
    _id: {type: String},
    seq: { type: Number, default: 0 }
    }
)
counterSchema.static('increment',  async function(counterName) {
    const counter = await this.findByIdAndUpdate({_id: counterName}, { $inc: { seq: 1 } },{ new: true, upsert: true })
    return counter.seq
})


const Counter = mongoose.model<ICounter, CounterModel>('counter', counterSchema)

export default Counter