import {app} from './app.js'
import 'dotenv/config'
import {dbConnect} from './config/dbConnect.js';

console.log(process.env.DB_PASSWORD)

//define server port
const PORT = process.env.PORT || 4000

//check database connection
dbConnect()
    .then(
        //if connection establish listen to the app
        app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`
    )
))

