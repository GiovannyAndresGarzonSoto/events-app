import mongoose, {connect} from 'mongoose' 

mongoose.set('strictQuery', false)
export const connectDatabase = async() => {
    try{
        await connect(`mongodb+srv://${process.env.MONGODB_ATLAS_URI}@cluster0.jfmq85b.mongodb.net/events-db`)
        console.log('Database is connected!')
    }catch(err){
        console.log(err)
    }
}