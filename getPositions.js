const request_promise = require('request-promise')
const logger = require('../breezySQL/winston/logger')
const { AUTH_TOKEN, COMPANY_ID } = require('./config')

const getPositions = async () => {

    var states = ['published', 'closed']
    var positionsArray = []

    for (var state of states) {

        try {
            var response = await request_promise({ url: `https://api.breezy.hr/v3/company/${COMPANY_ID}/positions?state=${state}`, headers: {'Authorization': AUTH_TOKEN} })
            var responseJson = JSON.parse(response)
        
            
            for (let obj of responseJson) {
                let positionObj = new Object()
                positionObj.id = obj._id
                positionObj.state = obj.state
                positionObj.name = obj.name
                positionsArray.push(positionObj)
            }

            console.log(`DB updated with ${state} positions`)
            
        } catch (e) {
            console.log(e);
        }
    }

    return positionsArray
    
}

module.exports = getPositions
