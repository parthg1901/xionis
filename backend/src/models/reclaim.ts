import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IReclaim {
  _id: string;
  address: string,
  verified: string[],
}

const reclaimSchema = new Schema<IReclaim>({
  address: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: [
      String
    ],
    default: []
  }
});

export default mongoose.model<IReclaim>('Reclaim', reclaimSchema);