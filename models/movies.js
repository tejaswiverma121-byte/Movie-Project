const mongoose= require('mongoose');

const movieSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    year:Number,
    img:{
        type:String,
        // required:true,
        default:"https://thumbs.dreamstime.com/b/movie-night-retro-poster-design-cinema-popcorn-graphic-film-strip-entertainment-brochure-template-97475695.jpg"

    },
    desc:{
        type:String,
        
    },
    reviews:[{
            rating:{
                type:Number,
                min:0,
                max:5,

            },
        comment:{
            type:String,
            required:true
        }
    }],
    favorite:{
        type:Boolean,
        default:false
    }
})


const Movie=mongoose.model('Movie',movieSchema);

module.exports=Movie;