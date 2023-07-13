const autoCompleteConfig={
    renderOption: movie => {
        const imgSrc = movie.Poster === 'N/A' ? 'images/imageNotAvailable.png' : movie.Poster
        return `
                <img src=${imgSrc} />
                ${movie.Title} (${movie.Year})
            `
    },
    inputValue: movie => {
        return movie.Title
    },
    fetchData : async (searchTerm) => {
        //'http://www.omdbapi.com/'
        const response = await axios.get('https://www.omdbapi.com/',{
            params : {
                apikey : 'bf7df182',
                s:searchTerm
            }
        })
        if(response.data.Error){
            return []
        }
        return response.data.Search
    }
}
createAutoComplete({
    root:document.querySelector('#left-autocomplete'),
    ...autoCompleteConfig,
    onOptionSelect : (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie,document.querySelector('#left-summary'),'left')
    }
})
createAutoComplete({
    root:document.querySelector('#right-autocomplete'),
    ...autoCompleteConfig,
    onOptionSelect : movie => {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie,document.querySelector('#right-summary'),'right')
    }
})
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement,side) =>{
    // console.log(movie)
    const response = await axios.get('http://www.omdbapi.com/',{
        params : {
            apikey : 'bf7df182',
            i: movie.imdbID
        }
    })
    summaryElement.innerHTML = movieTemplate(response.data)
    if(side==='left'){
        leftMovie=response.data
    }else{
        rightMovie=response.data
    }
    if(leftMovie && rightMovie){
        runComparision()
    }
}

const runComparision =()=>{
    // console.log('Time to Comparison')
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')
    leftSideStats.forEach((leftStat,index) => {
        const rightStat = rightSideStats[index]
        let leftValue = parseFloat(leftStat.dataset.value)
        leftValue = isNaN(leftValue)?0:leftValue
        let rightValue = parseFloat(rightStat.dataset.value)
        rightValue = isNaN(rightValue)?0:rightValue
        // console.log(leftValue , rightValue)
        if(leftValue < rightValue){
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-warning')
            rightStat.classList.add('is-primary')
            rightStat.classList.remove('is-warning')
        }else{
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-warning')
            leftStat.classList.add('is-primary')
            leftStat.classList.remove('is-warning')
        }
    })
}

const movieTemplate = movieDetail => {
    // console.log(movieDetail)
    const dollars=parseInt(movieDetail.BoxOffice.replace(/\$|\,/g,''))
    const metascore=parseInt(movieDetail.Metascore)
    const imdbRating = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''))
    const awards = movieDetail.Awards.split(' ').reduce((prev,word)=>{
        const value = parseInt(word)
        if(isNaN(value))
            return prev
        else    
            return prev+value
    },0)
    // console.log(awards,dollars,metascore,imdbRating,imdbVotes)

    return `
        <article class="media">
            <figure class="media-left">
            <p class="image">
            
                <!--<img src="${movieDetail.Poster}" alt="moviePoster" /> -->
                <img src="${movieDetail.Poster === 'N/A' ? 'images/imageNotAvailable.png' : movieDetail.Poster}" alt="moviePoster" />
            </p>
            </figure>
            <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}




