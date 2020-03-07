const body = document.querySelector('body');
const counterbar = document.querySelector('.header__counter-bar-strip')

const genres = document.querySelector('.nav__genres')
const genreLinks = document.querySelectorAll('.genre-link')
let pageLinks

const eventInfo = document.querySelector('.events-section');

const pageWrapper = document.querySelector('.page-wrapper')
const pageList = document.querySelector('.page-list')

const imgPlaceholder = 'https://via.placeholder.com/140x100';
const jsonImg = 'event.images.images[0]transforms.transforms[2].url';


//four missing genres: choir, vocal music; classical music, musicals, opera
const getEvents = (genreID = 6, genreName = 'All gigs', offset = 0) => {
    const username = 'aucklandgigs';
    const password = '7fgrzf2gvz3j';
    const url = `https://cors-anywhere.herokuapp.com/http://api.eventfinda.co.nz/v2/events.json?location=28&category=${genreID}&rows=10&offset=${offset}`;

    const request = new XMLHttpRequest();

    request.open('GET', url)

    //showing 1 to 60
    request.addEventListener('readystatechange', () => {
        if (request.readyState === 4 && request.status === 200) {
            const data = JSON.parse(request.responseText);
            const events = data.events;
            const count = data["@attributes"].count

            // HEADER
                //total events counter 
            counterbar.innerHTML = `
            <p><strong>${count}</strong> upcoming gigs in the Auckland Central area!</p>
            `
            //  showing 1 to 60
            //write function or whatever
            // if count is 0, display: no upcoming gigs

            eventInfo.innerHTML = `
            <h2 class="genre-heading">${genreName} (${count})</h2>
            <p class="showing-list"><strong>showing ${'1'} to ${'10'}</strong></p>

            ${events.map(eventTemplate).join('')}
            `
            // FOOTER
            pagination(count, setPageLink)
        } 
    })

    request.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    request.send()
}

// another request for total gigs? 

const eventTemplate = (event) => {
    return `
        <div class="event">
            <div class="event-img">
                <img src="${event.images.images[0].transforms.transforms[2].url}">
            </div>
            
            <div class="event-info">
                <h2 class="event-name">${event.name}</h2>
                <p class="event-location">${event.location_summary}</p>
                <span class="event-genre">${event.category.name}</span>
                <span class="event-age"> - ${event.restrictions}</span>
                <p class="event-description">${event.description}</p>
            </div>
        </div>
        `
};

genreLinks.forEach(genre => {
    genre.addEventListener('click', e => {
        e.preventDefault();

        //reassigns 'active-genre' class
        genreLinks.forEach(link => {
            link.classList.remove('active-genre')
        })
        e.target.classList.add('active-genre')

        //refreshes page
        eventInfo.innerHTML = '';
        pageList.innerHTML = '';

        const genreID = e.target.getAttribute('data-target')
        const genreName = e.target.text

        getEvents(genreID, genreName)
    })
})

// is callback function really needed?
const pagination = (count, callback) => {
    const numberOfPages = Math.ceil(count/10);

    if (numberOfPages > 1) {
        for (let page = 1; page <= numberOfPages; page++) {
            pageList.innerHTML += `<li><a class="page-link" href="#">${page}</a></li>`
        }
    }

    callback() // calls setPageLink function
}

//replace the nested forEach with filter method
const setPageLink = () => {
    pageLinks = document.querySelectorAll('.page-link')

    //need to reassign active page highlight....
    // pageLinks[0].classList.add('active-page')

    let offset;

    pageLinks.forEach(page => {
        page.addEventListener('click', e => {
            e.preventDefault();

            //refreshes page
            eventInfo.innerHTML = '';
            pageList.innerHTML = '';

            //get offset
            const pageNo = e.target.innerText
            offset = (pageNo - 1) * 10

            //get genre info
            const genre = document.querySelector('.active-genre')
            const genreName = genre.textContent
            const genreID = genre.getAttribute('data-target')

            getEvents(genreID, genreName, offset)
        })
    })
}