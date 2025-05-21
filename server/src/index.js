import {app} from './app.js'
import 'dotenv/config'
import {dbConnect} from './config/dbConnect.js';

//server port
const PORT = process.env.PORT || 4000

//check database connection
dbConnect()
    .then(
        //listen to the app after database connection established
        app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`
    )
))

