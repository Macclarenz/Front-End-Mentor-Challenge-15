import {
    getDetail
} from "./createCountryDetails.js"

// - This is a global variable arr to track the current data
let currentArrOfCountries = []
const generateCards = async (jsonResponse) => {
    const cardContainer = document.querySelector('.card-container')
    const rawResponse = jsonResponse[0]
    const currentArr = jsonResponse[1]

    // - Assigning the raw data to global arr
    currentArrOfCountries = jsonResponse[1]

    try {
        if (!rawResponse) throw new Error('Result Falsy or Empty!')
        else {
            while (cardContainer.firstChild) {
                cardContainer.removeChild(cardContainer.firstChild)
            }
            const renderedData = await renderData(rawResponse)
            return await createElement(renderedData, currentArr)
        }
    } catch (err) {
        console.error(err)
    }
}

const generatePartialCards = async (partialName) => {
    const arrPartialCountries = []
    // - If the partialName is falsy then fallback to ''. but if not the capitalize the first letter
    const renderedPartialName = !partialName ? '' : partialName[0].toUpperCase() + partialName.slice(1)
    const cardContainer = document.querySelector('.card-container')

    try {
        // - This is to checck if the partial name shares some similarities for possible result and then create the element
        currentArrOfCountries.forEach(el => {
            if (el.name.common.includes(renderedPartialName)) {
                arrPartialCountries.push(el)
            }
        })

        if (!arrPartialCountries) throw new Error('Empty or falsy result') 
        else {
            // - Removes every child element to create a new element
            while (cardContainer.firstChild) {
                cardContainer.removeChild(cardContainer.firstChild)
            }

            // - Renders the data before creating a new element
            const renderedData = await renderData(arrPartialCountries)
            return await createElement(renderedData, currentArrOfCountries)
        }
    } catch (err) {
        console.error(err)
    }
}

const renderData = (jsonResponse) => {
    return new Promise((resolve, reject) => {
        const newArr = []

        jsonResponse.forEach(el => {
            const {
                name,
                population = 'Unrecorded',
                region = 'Unknown',
                capital = 'Unknown',
                flags
            } = el

            const {
                common
            } = name
            const {
                svg: flagImg = flags.png
            } = flags // - in case there's no svg, png will be substitute

            const renderPopulation = new Intl.NumberFormat().format(population)
            const renderCapital = renderRawData(capital, 'capital')

            newArr.push({
                common,
                renderPopulation,
                region,
                renderCapital,
                flagImg
            })
        })

        // console.log(newArr)  // - to log the rendered data
        // console.log(jsonResponse)    // - to log the raw data
        resolve(newArr)
    })
}

const renderRawData = (rawArr, category) => {
    if (Array.isArray(rawArr)) {
        if (category === 'capital') {
            return rawArr.join(', ')
        }
    } else if (!rawArr || typeof rawArr === 'string') return rawArr
}

const createElement = async (renderedData, currentArr) => {
    return await new Promise((resolve, reject) => {
        const cardContainer = document.querySelector('.card-container')
        const cards = document.querySelectorAll('.card')

        renderedData.forEach((el, index) => {
            if (index < 32) {
                const createElement = document.createElement('div')
                createElement.classList.add('card')
                cardContainer.appendChild(createElement)
                createElement.innerHTML = `
                <img src="${el.flagImg}" alt="flag">
                <section class="small-detail-container">
                    <h2>${el.common}</h2>
                    <p>Population: <span class="spanPopulation">${el.renderPopulation}</span></p>
                    <p>Region: <span class="spanRegion">${el.region}</span></p>
                    <p>Capital: <span class="spanCapital">${el.renderCapital}</span></p>
                </section>
                `               
            } else return
        })

        resolve()
    }).then(() => {
        const cards = document.querySelectorAll('.card')
        cards.forEach(el => {
            el.addEventListener('click', e => {
                const countryName = e.target.childNodes[3].childNodes[1].textContent
                getDetail(countryName, currentArr)
            })
        })
    })
}

export {
    generateCards,
    generatePartialCards
}