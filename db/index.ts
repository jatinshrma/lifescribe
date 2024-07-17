import * as mongoose from "mongoose"

const { MONGODB_URI = "" } = process.env

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

// @ts-ignore
let cached = global.mongoose

if (!cached) {
	// @ts-ignore
	cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDB() {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferCommands: true
		}

		cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
			return mongoose
		})
	}
	cached.conn = await cached.promise
	return cached.conn
}

export default connectToDB
