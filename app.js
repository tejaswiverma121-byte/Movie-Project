const express =require('express');

const app= express();

const path= require('path');

const mongoose=require('mongoose');
const seed=require('./seed')
const Movie=require('./models/movies');
app.use(express.urlencoded({extended:true}))
const methodOverride = require('method-override');
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const ai=new GoogleGenAI({apiKey:process.env.apiKey});

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// mongoose.connect('app.use(express.urlencoded({extended:true}));')
mongoose.connect('mongodb://127.0.0.1:27017/Movies')
.then(()=>{
    console.log('DB connected');
})


// app.get('/',async(req,res)=>{
//     const allMovies= await Movie.find();

//     // res.send(allMovies);

//     res.render('index.ejs',{allMovies})
// })
    app.get('/search',async(req,res)=>{
        const {q}=req.query;
        
        if(q){

        const allMovies=await Movie.find({$or: [{name:{$regex: q,$options:'i'}},{desc:{$regex: q,$options:'i'}}]})
        res.render('index.ejs',{allMovies})

    }
    else{
            const allMovies= await Movie.find();
            res.render('index.ejs',{allMovies})
    }
    })

app.get('/new', (req,res)=>{
    res.render('new.ejs')
})

app.post('/create',async(req,res)=>{
  const {name,year,img,desc}=req.body;

//   console.log(name,year,img,desc);

  await Movie.insertOne({name,year,img,desc});

  res.redirect('/');

})
app.get('/movie/edit/:id',async (req,res)=>{
    const {id}=req.params;
    const m=await Movie.findById(id);
    res.render('edit.ejs',{m})
})

app.put('/movie/edit/:id',async (req,res)=>{
    const {id}=req.params;
    const {name,year,img,desc}=req.body;

    const m=await Movie.findByIdAndUpdate(id,{name,year,img,desc});
    
    res.redirect('/')
})
app.get('/movies/:id',async (req,res)=>{
    const {id}=req.params;
    const m=await Movie.findById(id);
    console.log(m);
    res.render('show.ejs',{m})
})

app.delete('/movie/delete/:id',async (req,res)=>{
    const {id}=req.params;

    await Movie.findByIdAndDelete(id);

    res.redirect('/')
})
app.post('/review/delete/:movieId/:reviewId', async (req, res) => {
    const { movieId, reviewId } = req.params;

    const movie = await Movie.findById(movieId);

    movie.reviews = movie.reviews.filter(r => r._id != reviewId);

    await movie.save();

    res.redirect(`/movies/${movieId}`);
});
app.post('/rating/:id',async(req,res)=>{
    const {id}=req.params;
    const {rating,comment}=req.body;

    const m= await Movie.findById(id);
    m.reviews.push({rating,comment});
    await m.save();

    console.log(m);

    res.redirect(`/movies/${id}`);
})

app.get('/',async(req,res)=>{
    const allMovies= await Movie.find();

   for (let movie of allMovies) {
    let sum = 0;

    if (movie.reviews && movie.reviews.length > 0) {
        for (let r of movie.reviews) {
            sum += Number(r.rating);
        }
        movie.avgRating = (sum / movie.reviews.length).toFixed(1);
    } else {
        movie.avgRating = 0;
    }
}
    res.render('index.ejs',{allMovies})
})
app.get('/trending',async(req,res)=>{
    const allMovies= await Movie.find();

    for (let movie of allMovies) {
        let sum = 0;    
        if (movie.reviews && movie.reviews.length > 0) {
            for (let r of movie.reviews) {
                sum += Number(r.rating);
            }
            movie.avgRating = (sum / movie.reviews.length).toFixed(1);
        } else {
            movie.avgRating = 0;
        }   

    }
    allMovies.sort((a,b)=>b.avgRating-a.avgRating);
        const top= allMovies.slice(0,3);
    res.render('trending.ejs',{top})
})
app.get('/favorite', async (req, res) => {
    const favMovies = await Movie.find({ favorite: true });

    for (let movie of favMovies) {
        let sum = 0;

        if (movie.reviews?.length) {
            for (let r of movie.reviews) {
                sum += Number(r.rating);
            }
            movie.avgRating = (sum / movie.reviews.length).toFixed(1);
        } else {
            movie.avgRating = 0;
        }
    }

    res.render('favorite.ejs', { favMovies });
});
app.post('/favorite/:id', async (req, res) => {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    movie.favorite = !movie.favorite; 

    await movie.save();
    console.log(movie.favorite);
    res.redirect('/'); 
});

app.get('/summary/:id',async (req,res)=>{
    const {id}=req.params;
    const m=await Movie.findById(id);

       const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt(m),
       });
       const data=JSON.parse(response.text);

//   console.log("json",data);
//   console.log("json",response.title);

  res.render('summary.ejs',{m,data});
})
   
function prompt(m){
  return `You are a movie information assistant.

Input:
Movie Name: ${m.name}
Year of Release: ${m.year}

Task:
1. Generate a summary of the movie in approximately 200 words.
2. Provide a list of main cast members with their character names.
3. Provide a poster image URL (use a valid public movie poster link if possible).

Output ONLY in JSON format like this:

{
  "title": "Movie Name",
  "year": "Year",
  "summary": "200-word summary here",
  "poster": "image_url_here",
  "cast": [
    "Actor as Character",
    "Actor as Character",
    "Actor as Character"
  ]
}`
}
// seed();


app.listen(3000,()=>{
    console.log('server has started')
})