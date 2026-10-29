import express from "express";
import { startDB } from "./src/config/database.js";


const app = express();
const PORT = process.env.PORT ||3001;



app.listen(PORT, async () =>{
    await startDB();
    console.log(`servidor corriendo en el puerto${PORT}`);
    
    
})