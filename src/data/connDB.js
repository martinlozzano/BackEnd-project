import mongoose from "mongoose"

const mongo_url = "mongodb+srv://ecommerce:1234@cluster0.tlsjd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

export const connDB = async() => {
    try {
        await mongoose.connect(
            mongo_url,
            {dbName: "ecommerce"}
        )
        console.log(`*DB conectada*`)
    } catch (error) {
        console.log(`Error al conectar a DB: ${error.message}`)
    }
}