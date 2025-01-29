import mongoose from "mongoose";

const uri = "mongodb+srv://mamanirolando2609:VdT0WTmb1nZpPFmP@coderback.pgh1w.mongodb.net/?retryWrites=true&w=majority&appName=coderback"

const connectionMongo = async ()=>{
    try {
        await mongoose.connect(uri, {
            dbName: 'Products'
        })
    } catch (error) {
        console.log("error al conectarse a la base de datos");
    }
}

export default connectionMongo;