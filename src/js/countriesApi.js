// - Make a GET request from an api
const request = async(param) => {
    const url = 'https://restcountries.com/v3.1/'
    const endpoint = url + param

    try {
        const response = await fetch(endpoint, {
            cache: 'no-cache'
        })

        if (response.ok) {
            const jsonResponse = await response.json()
            // console.log(jsonResponse)    // - Logs the raw result
            const currentArrCountries = jsonResponse
            return [jsonResponse, currentArrCountries]
        } else throw new Error('Failed to Connect!')
    } catch(err) {
        console.error(err)
    }
}

export {
    request
}