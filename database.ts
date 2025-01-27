import mongoose, {connect} from 'mongoose' 

mongoose.set('strictQuery', false)
export const connectDatabase = async() => {
    try{
        await connect(`mongodb://localhost:27017/events-db`)
        console.log('Database is connected')
    }catch(err){
        console.log(err)
    }
}