import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { type } from 'node:os'
const app = express()
// leer JSON en ESMODULES 
// import fs from 'node:fs'
// const movies =fs.readFileSync('./movies.json','utf-8')

//** segunda forma //
// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)
// const movies = require('./movies.json')
app.use(json())   // middleware que recibe las respuestas en formato JSON y las tranforma a objetos de JS
app.disable('x-powered-by')

app.get('/',(req,res)=>{
    res.json({
        Curso:'Base de Gatos ',
        Profesor:'Pastor'
    })
})
app.use('/movies',moviesRouter)


const PORT = process.env.PORT ?? 1234

app.listen(PORT,()=>{
    console.log(`Excuchando en http://localhost:${PORT}/`);
})
