const getDetail = (countryName, currentArr) => {
    const flagOfCountry = document.querySelector('.detail-flag-img')
    const nameOfCountry = document.querySelector('#detailName')
    const nativeNameOfCountry = document.querySelector('#detailNativeName')
    const populationOfCountry = document.querySelector('#detailPopulation')
    const regionOfCountry = document.querySelector('#detailRegion')
    const subregionOfCountry = document.querySelector('#detailSubRegion')
    const capitalOfCountry = document.querySelector('#detailCapital')
    const tldOfCountry = document.querySelector('#detailTLD')
    const currenciesOfCountry = document.querySelector('#detailCurrencies')
    const languagesOfCountry = document.querySelector('#detailLanguages')
    const bordersOfTheCountry = document.querySelector('.border-list')

    while(bordersOfTheCountry.firstChild) {
        bordersOfTheCountry.removeChild(bordersOfTheCountry.firstChild)
    }

    currentArr.forEach(el => {
        if (el.name.common === countryName) {
            const {
                common,
                nativeName,
                renderedPopulation,
                region,
                subregion,
                capital,
                tld,
                currencies,
                languages,
                borders,
                flagImg
            } = renderData(el)

            nameOfCountry.innerText = common
            nativeNameOfCountry.innerText = nativeName
            populationOfCountry.innerText = renderedPopulation
            regionOfCountry.innerText = region
            subregionOfCountry.innerText = subregion
            capitalOfCountry.innerText = capital
            tldOfCountry.innerText = tld
            currenciesOfCountry.innerText = currencies
            languagesOfCountry.innerText = languages

            flagOfCountry.setAttribute('src', flagImg)

            if (Array.isArray(borders)) {
                borders.forEach((el, index) => { 
                    const li = document.createElement('li')
                    bordersOfTheCountry.appendChild(li)
                    li.innerText = el
                })
            } else {
                const li = document.createElement('li')
                bordersOfTheCountry.appendChild(li)
                li.innerText = borders
            }

            const detailContainer = document.querySelector('.detail-container')
            detailContainer.classList.add('detail-open')

            const backButton = document.querySelector('#detailBackButton')
                .addEventListener('click', (e) => {
                    detailContainer.classList.remove('detail-open')
                })

            return
        }
    })
}

const renderData = (element) => {
    const {
        name,
        population = 'Unrecorded',
        region = 'Unknown',
        subregion = 'Unknown',
        capital = 'No Capital',
        tld = 'Unknown',
        currencies = 'Unrecorded',
        languages,
        borders = 'No Borders',
        flags
    } = element

    const {
        common,
        nativeName
    } = name

    const {
        png,
        svg: flagImg = png
    } = flags

    const renderedPopulation = typeof population === 'number' ? new Intl.NumberFormat().format(population) : population
    return {
        common,
        nativeName: renderComplexData(nativeName, 'nativeName'),
        renderedPopulation,
        region,
        subregion,
        capital: Array.isArray(capital) || capital ? renderComplexData(capital, 'capital') : capital,
        tld: Array.isArray(tld) || tld ? renderComplexData(tld, 'tld') : tld,
        currencies: renderComplexData(currencies, 'currency'),
        languages: renderComplexData(languages, 'language'),
        borders: borders ? borders : borders,
        flagImg
    }
}

const renderComplexData = (data, category) => {
    const newArr = []
    let index = 0

    if (Array.isArray(data)) {
        if (category === 'capital' || category === 'tld' || category === 'border') {
            return data.join(', ')
        }
    } else if (typeof data === 'object') {
        if (category === 'currency') {
            for (const currencies of Object.values(data)) {
                newArr.push(currencies.name)
            }
        } else if (category === 'language') {
            for (const languages of Object.values(data)) {
                newArr.push(languages)
            }
        } else if (category === 'nativeName') {
            const val = Object.values(data)
            const randomIndex = Math.floor(Math.random() * val.length)
            return val[randomIndex].common
        }
    } else if (typeof data === 'string' || !data) {
        return data
    }

    if (newArr.length > 5) {
        const sliced = newArr.slice(0, 5)
        return sliced.join(', ') + ` and ${newArr.slice(sliced.length).length} more`

    } else {
        return newArr.join(', ')
    }

}

export {
    getDetail
}