const body = document.querySelector('body');
const counterbar = document.querySelector('.header__counter-bar-strip')

const genres = document.querySelector('.nav__genres')
const genreLink = document.querySelectorAll('.genre-link')

const eventInfo = document.querySelector('.events-section');

const pageWrapper = document.querySelector('.page-wrapper')
const pageList = document.querySelector('.page-list')

const imgPlaceholder = 'https://via.placeholder.com/140x100';
const jsonImg = 'event.images.images[0]transforms.transforms[2].url';

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

const pagination = (count) => {
    const numberOfPages = Math.ceil(count/10);

    pageList.innerHTML = '';

    if (numberOfPages > 10) {
        for (let page = 1; page <= numberOfPages; page++) {
            pageList.innerHTML += `<li><a href="#">${page}</a></li>`
        }
    }
}


const getEventsData = () => {
    const username = 'aucklandgigs';
    const password = '7fgrzf2gvz3j';
    const url = 'https://cors-anywhere.herokuapp.com/http://api.eventfinda.co.nz/v2/events.json?location=28&category=6&rows=10&offset=0';

    const request = new XMLHttpRequest();

    request.open('GET', url)

    request.addEventListener('readystatechange', () => {
        if (request.readyState === 4 && request.status === 200) {
            const data = JSON.parse(request.responseText);
            const events = data.events;
            const count = data["@attributes"].count

            counterbar.innerHTML = `
            <p><strong>${count}</strong> upcoming gigs in the Auckland Central area!</p>
            `
            
            eventInfo.innerHTML = `
            <h2 class="genre-heading">All gigs (${count})</h2>
            ${events.map(eventTemplate).join('')}
            `

            pagination(count)
        } 
    })

    request.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    request.send()
}


//!!! pagination isn't working for genre clicks
genreLink.forEach(genre => {
    genre.addEventListener('click', e => {
        e.preventDefault();
        eventInfo.innerHTML = '';
        pageList.innerHTML = '';

        //HttpRequest - this is duplicate code! 
        const genreID = e.target.getAttribute('data-target')
        const genreName = e.target.text
        
        const username = 'aucklandgigs';
        const password = '7fgrzf2gvz3j';
        const url = `https://cors-anywhere.herokuapp.com/http://api.eventfinda.co.nz/v2/events.json?location=28&category=${genreID}&rows=10&offset=0`;
    
        const request = new XMLHttpRequest();
    
        request.open('GET', url)
    
        request.addEventListener('readystatechange', () => {
            if (request.readyState === 4 && request.status === 200) {
                const data = JSON.parse(request.responseText);
                const events = data.events;
                const count = data["@attributes"].count
                
                eventInfo.innerHTML = `
                <h2 class="genre-heading">${genreName} (${count})</h2>
                ${events.map(eventTemplate).join('')}
                `
                pagination(count)
            } 
        })
    
        request.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
        request.send()
    })
})

////////////////////


// const getAllEvents = async () => {
    
//     const allEvents = []; //where all events are stored

//     const username = 'aucklandgigs';
//     const password = '7fgrzf2gvz3j';

//     const url = 'https://cors-anywhere.herokuapp.com/http://api.eventfinda.co.nz/v2/events.json';
//     const query = `?location=28&category=6&rows=20`;
//     const offset = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240]; // offset iteration

//     for (let i = 0; i < offset.length; i++) {
//             const offsetQuery = `&offset=${offset}`;
 
//             const response = await fetch(url + query + offsetQuery);
//             const data = response.json();
//             console.log(data);
//         }
// }

// getAllEvents()