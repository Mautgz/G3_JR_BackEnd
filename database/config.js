const mongoose = require('mongoose');

//conexion a la base de datos en la nube
const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('DB online');

    }catch (error){
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }

}
module.exports = {
    dbConnection
}