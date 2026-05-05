const mongoose=require('mongoose');
const Movie = require('./models/movies');


const dummyMovies = [
{
name: "Interstellar",
year: 2014,
img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
desc: "A team travels through a wormhole in space in an attempt to ensure humanity's survival."
},
{
name: "Fight Club",
year: 1999,
img: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
desc: "An insomniac office worker and a soap maker form an underground fight club."
},
{
name: "Avengers: Endgame",
year: 2019,
img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
desc: "The Avengers assemble once more to reverse Thanos' actions."
},
{
name: "Joker",
year: 2019,
img: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
desc: "A mentally troubled comedian embarks on a downward spiral."
},
{
name: "Parasite",
year: 2019,
img: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
desc: "Greed and class discrimination threaten a newly formed symbiotic relationship."
},
{
name: "Whiplash",
year: 2014,
img: "https://image.tmdb.org/t/p/w500/lIv1QinFqz4dlp5U4lQ6HaiskOZ.jpg",
desc: "A promising drummer enrolls at a cut-throat music conservatory."
},
{
name: "Gladiator",
year: 2000,
img: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
desc: "A former Roman General sets out to exact vengeance."
},
{
name: "Spider-Man: No Way Home",
year: 2021,
img: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
desc: "Spider-Man's identity is revealed, bringing chaos."
}
];
function seed(){
    Movie.insertMany(dummyMovies)
    .then(()=>{
        console.log("Data inserted successfully")
    })
    .catch((error)=>{
        console.error("Error inserting data:",error)
    })
}

module.exports =seed;