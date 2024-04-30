import { Router } from "express"
import movies from '../movies.json' with {type : 'json'} //with para leer los json
import { randomUUID } from 'node:crypto'
import { validateMovie, valPartialMovie } from '../schemas/movies.js'
export const moviesRouter = Router()

const ACEEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://127.0.0.1:5500',
    'http://localhost:1234',
    'http://movies.com',
    ''
]

moviesRouter.get('/',(req,res)=>{
    const origin = req.header('origin')
    if (ACEEPTED_ORIGINS.includes(origin)|| !origin) {
        res.header('Access-Control-Allow-Origin',origin)
    }
    const {genre} = req.query
    if (genre) {
        const filterMov = movies.filter(
            movie => movie.genre.some(g=>g.toLocaleLowerCase()===genre.toLocaleLowerCase())
        ) 
        return res.json(filterMov)
    }
    res.json(movies)
})
moviesRouter.get('/:id',(req,res)=>{
    const { id } = req.params
    const movie = movies.find(movie =>movie.id === id)
    if(movie){
        return res.json(movie)
    }

    res.status(404).json({
        messaje:'Pelicula no Encontrada'
    })
})

moviesRouter.post('/',(req,res)=>{
    const result = validateMovie(req.body)
    if (result.error) {
        res.status(402).json({
            error:JSON.parse(result.error.message)
        })
    }
    const newMovie ={
        id : randomUUID(),
        ...result.data
    }
    movies.push(newMovie)

    res.status(201).json(newMovie)
    
})

moviesRouter.patch('/:id',(req,res)=>{
    const result = valPartialMovie(req.body)
    if (!result.success) {
        return res.status(404).json({
            error: JSON.parse(result.error.message)
        })
    }
    const {id} = req.params
    const movieIndex = movies.findIndex(movie =>movie.id === id)
    if (movieIndex ===-1) {
        return res.status(404).json({
            message:"Movie Not Found"
        })
    }
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex]=updateMovie
    return res.json(updateMovie)
})
moviesRouter.delete('/:id',(req,res)=>{
    const origin = req.header('origin')
    if (ACEEPTED_ORIGINS.includes(origin)|| !origin) {
        res.header('Access-Control-Allow-Origin',origin)
    }
    
    const {id} = req.params
    const movieIndex = movies.findIndex(movie =>movie.id=== id)
    if (movieIndex === -1) {
        return res.status(404).json({
            message:'Movie not Found'
        })
    }
    movies.splice(movieIndex,1)

    return res.json({
        messaje:'Movie Deleted'
    })
})

moviesRouter.options('/:id',(req,res)=>{
    const origin = req.header('origin')
    if (ACEEPTED_ORIGINS.includes(origin)|| !origin) {
        res.header('Access-Control-Allow-Origin',origin)
        res.header('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE')
    }
    res.send(200)
})