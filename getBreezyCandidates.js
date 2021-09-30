const request_promise = require('request-promise')
const { AUTH_TOKEN, COMPANY_ID, DB_HOST, DB_USER, DB_PASSWORD, DATABASE } = require('./config')

const mysql = require('mysql')

const getBreezyCandidates = async (positionIds) => {

    

    for (let position of positionIds) {

        try {
            let response = await request_promise({ url: `https://api.breezy.hr/v3/company/${COMPANY_ID}/position/${position.position_id}/candidates`, headers: {'Authorization': AUTH_TOKEN} })
            let responseJson = JSON.parse(response)
            let candidates_batch = new Object()
            candidates_batch = responseJson
            
    
            for(let candidate of candidates_batch) {
                candidate.position_name = position.position_name
                candidate.position_id = position.position_id
                candidate.position_state = position.position_state
            }

            
            const db = mysql.createConnection({
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD, 
                database: DATABASE
            })
        
            const days_anonymize = 180
            const days_update = 200
            var new_counter = 0
            var old_counter = 0
            var anonymized_counter = 0
        
            let sql_ids = 'SELECT candidate_id FROM GoogleCalendar.breezyCandidates'
            db.query(sql_ids, (err, result) => {
                if (err) {
                    console.log(err);
                }
        
                let db_candidate_ids = result.map( obj => { return obj.candidate_id })
                let thirty_days_ago = new Date().getTime() - 1000 * 60 * 60 * 24 * days_update
                let six_months_ago = new Date().getTime() - 1000 * 60 * 60 * 24 * days_anonymize
        
                for (var candidate of candidates_batch) {
                    let update_date_format = candidate.updated_date
                    let update_date = Date.parse(update_date_format)
        
                    let creation_date_format = candidate.creation_date
                    let creation_date = Date.parse(creation_date_format)
        
                 
                    // UPDATE
                    if (db_candidate_ids.includes(candidate._id) && (update_date < thirty_days_ago)) {
                        old_counter = old_counter + 1
                        continue
        
                    }  else if (db_candidate_ids.includes(candidate._id) && (update_date > thirty_days_ago)) {
                        
                        if (candidate.source === undefined || candidate.source === null) {
                            let update_sql = `UPDATE GoogleCalendar.breezyCandidates SET ? WHERE candidate_id = '${candidate._id}'`
                            let post = {candidate_id: `${candidate._id}`, candidate_meta_id: `${candidate.meta_id}`, candidate_name: `${candidate.name}`, candidate_email: `${candidate.email_address}`, origin: `${candidate.origin}`, source: 'undefined', position_name: `${candidate.position_name}`, position_id: `${candidate.position_id}`, position_state: `${candidate.position_state}`, latest_stage: `${candidate.stage.name}`, tags: `${candidate.tags}`, creation_date: `${candidate.creation_date}`, update_date: `${candidate.updated_date}`}
                            db.query(update_sql, post, (err, result) => {
                                if(err) {
                                    console.log(err);
                                }      
            
                            })
                            new_counter = new_counter + 1 
        
                        } else {
                            let update_sql = `UPDATE GoogleCalendar.breezyCandidates SET ? WHERE candidate_id = '${candidate._id}'`
                            let post = {candidate_id: `${candidate._id}`, candidate_meta_id: `${candidate.meta_id}`, candidate_name: `${candidate.name}`, candidate_email: `${candidate.email_address}`, origin: `${candidate.origin}`, source: `${candidate.source.name}`, position_name: `${candidate.position_name}`, position_id: `${candidate.position_id}`, position_state: `${candidate.position_state}`, latest_stage: `${candidate.stage.name}`, tags: `${candidate.tags}`, creation_date: `${candidate.creation_date}`, update_date: `${candidate.updated_date}`}
                            db.query(update_sql, post, (err, result) => {
                                if(err) {
                                    console.log(err);
                                } 
            
                                
                            })
                            new_counter = new_counter + 1
                        }
        
                    } else if (candidate.source === undefined || candidate.source === null) {
                        let sql = 'INSERT INTO GoogleCalendar.breezyCandidates SET ?' 
                        let post = {candidate_id: `${candidate._id}`, candidate_meta_id: `${candidate.meta_id}`, candidate_name: `${candidate.name}`, candidate_email: `${candidate.email_address}`, origin: `${candidate.origin}`, source: 'undefined', position_name: `${candidate.position_name}`, position_id: `${candidate.position_id}`, position_state: `${candidate.position_state}`, latest_stage: `${candidate.stage.name}`, tags: `${candidate.tags}`, creation_date: `${candidate.creation_date}`, update_date: `${candidate.updated_date}`}
                        db.query(sql, post, (err, result) => {
                            if(err) {
                                console.log(err);
                            }
        
                    
                        })
                        new_counter = new_counter + 1  
        
                    } else {
                        let sql = 'INSERT INTO GoogleCalendar.breezyCandidates SET ?' 
                        let post = {candidate_id: `${candidate._id}`, candidate_meta_id: `${candidate.meta_id}`, candidate_name: `${candidate.name}`, candidate_email: `${candidate.email_address}`, origin: `${candidate.origin}`, source: `${candidate.source.name}`, position_name: `${candidate.position_name}`, position_id: `${candidate.position_id}`, position_state: `${candidate.position_state}`, latest_stage: `${candidate.stage.name}`, tags: `${candidate.tags}`, creation_date: `${candidate.creation_date}`, update_date: `${candidate.updated_date}`}
                        db.query(sql, post, (err, result) => {
                            if(err) {
                                console.log(err);
                            } 
        
                        })
                        new_counter = new_counter + 1
                    }
                }
               
             
                db.end()
            })
            
        } catch (e) {

            console.log(e)

            continue
        }

        console.log(`${position.position_name} - done!`);
        
    }

    console.log('Done');

}

module.exports = getBreezyCandidates

