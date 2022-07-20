import mongoose from 'mongoose';

const History = new mongoose.Schema({
	_id: String,
	tv_shows : [ { type: String, ref: "entity"} ],
	searched : [ String ],
	created: Date,
	online: Boolean,
}, { 
	collection: '__user_history',
	timestamps: false,
})


export default mongoose.model("History", History);