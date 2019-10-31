const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const cities = require('../../../model/mongoose/cities');
const skills = require('../../../model/mongoose/skills');
const enumerations = require('../../../model/enumerations');

module.exports.request = {
    type: 'get',
    path: '/skills/'
};

const querySchema = new Schema({
    autosuggest: String
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
}

module.exports.endpoint = async function (req, res) {
    let queryInput = req.query;
    const filteredExp = queryInput.autosuggest.replace(/[#^*~?{}|&;$%',.-_@"<>()+]/g, "");
    let regex = new RegExp(filteredExp, 'i');
    let outputOptions = [];

    let skillsDoc = await skills.findSortLimitSkip({name: {$regex: regex}});
    if(skillsDoc) {
        console.log(skillsDoc);
        for(let skill of skillsDoc) {
            outputOptions.push({skill : skill});
        }
    }

    res.send({
        skills: outputOptions
    });
}