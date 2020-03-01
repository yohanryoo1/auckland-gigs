const body = document.querySelector('body');
const counterbar = document.querySelector('.header__counter-bar-strip')

const genres = document.querySelector('.nav__genres')
const genreLink = document.querySelectorAll('.genre-link')

const eventInfo = document.querySelector('.events-section');

const pageWrapper = document.querySelector('.page-wrapper')
const pageList = document.querySelector('.page-list')


const imgPlaceholder = 'https://via.placeholder.com/140x100';
const jsonImg = 'event.images.images[0]transforms.transforms[2].url';


const getEvents = (genreID = 6, genreName = 'All gigs') => {
    const username = 'aucklandgigs';
    const password = '7fgrzf2gvz3j';
    const field = 'fields=event:(name)';
    const url = `https://cors-anywhere.herokuapp.com/http://api.eventfinda.co.nz/v2/events.json?location=28&category=${genreID}&rows=10&offset=0`;

    const request = new XMLHttpRequest();

    request.open('GET', url)

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
            // BODY
            eventInfo.innerHTML = `
            <h2 class="genre-heading">${genreName} (${count})</h2>

            ${events.map(eventTemplate).join('')}
            `
            // FOOTER
            pagination(count)
        } 
    })

    request.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    request.send()
}

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

    if (numberOfPages > 1) {
        for (let page = 1; page <= numberOfPages; page++) {
            pageList.innerHTML += `<li><a class="pg-link" href="#">${page}</a></li>`
        }
    }
}

getEvents()

async function getData() {
    const response = await getEvents()
    console.log('Response received')
}

// promise or async function needed
const pageButtons = document.getElementsByClassName('pg-link')
console.log(pageButtons[0].innerText)



// for (let i = 0; i < pageButtons.length; i++) {
//     console.log('hi')
// }

//not working from here on
// pageButtons.forEach(page => {
//     page.addEventListener('click', e => {
//         e.preventDefault();

//         // refreshes page
//         // eventInfo.innerHTML = '';
//         // pageList.innerHTML = '';

//         const pageNo = e.target.innerText;
//         console.log(pageNo)
//         // const genreID = ;
//         // const genreName = ;

//         // getEvents(genreID, genreName, )
//     })
// })

// eventlisteners
genreLink.forEach(genre => {
    genre.addEventListener('click', e => {
        e.preventDefault();

        //refreshes page
        eventInfo.innerHTML = '';
        pageList.innerHTML = '';

        const genreID = e.target.getAttribute('data-target')
        const genreName = e.target.text

        getEvents(genreID, genreName)
    })
})

