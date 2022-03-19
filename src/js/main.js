import {
    request
} from './countriesApi.js'

import {
    generateCards,
    generatePartialCards
} from './generateCards.js'

import {
    darkMode
} from './darkMode.js'

const filterCountry = document.querySelector('#filterCountry')
const formCountry = document.querySelector('#countryForm')
const searchCountry = document.querySelector('#searchInputText')
const darkModeButton = document.querySelector('#darkModeButton')

const sr = ScrollReveal()

const getData = async (value) => {
    const queryParams = value || 'all'.toLowerCase()
    const arrRegion = ['europe', 'americas', 'oceania', 'asia', 'africa']
    let finalQueryParam

    if (arrRegion.includes(queryParams)) {
        finalQueryParam = 'region/' + queryParams
    } else if (queryParams === 'all') {
        finalQueryParam = queryParams
    } else if (queryParams !== 'all' || !arrRegion.includes(queryParams)) {
        finalQueryParam = 'name/' + queryParams
    }

    try {
        const response = await request(finalQueryParam)
        return await generateCards(response)
    } catch (err) {
        console.error(err)
    }
}

// - Filters and display cards of country
filterCountry.addEventListener('change', (e) => {
    e.preventDefault()
    searchCountry.value = ''
    getData(e.target.value)
        .then(() => {
            sr.sync()
        })
})

// - To prevent the form from reloading
formCountry.addEventListener('submit', (e) => {
    e.preventDefault()
})

// - This is for when you searching for countries instead of using filters
const partialSearch = async (inputVal) => {
    try {
        return await generatePartialCards(inputVal)
            .then(() => {
                sr.sync()
            })
    } catch (err) {
        console.error(err)
    }
}

searchCountry.addEventListener('input', e => {
    partialSearch(e.target.value)
})

// - Request for data when the site is loading
const load = async () => {
    darkMode(checkDarkMode()) 

    return await getData()
        .then(() => {
            sr.reveal('.card', {
                delay: 0,
                distance: '100px',
                duration: 1000,
                origin: 'bottom',
                interval: 100,
                opacity: 0
            })
        })
}

const checkDarkMode = () => {
    const currentMode = sessionStorage.getItem('isItDarkMode')
    let currBoolean
    if (currentMode === 'false' || !currentMode) {
        currBoolean = 'true'
    } else {
        currBoolean = 'false'
    }

    return currBoolean
}

load()

// - Once trigger, it will invoke darkMode() 
darkModeButton.addEventListener('click', darkMode)
