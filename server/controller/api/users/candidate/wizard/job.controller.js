const User = require('../../../../../model/mongoose/users');
const errors = require('../../../../services/errors');

module.exports = async function (req,res)
{
	let userId = req.auth.user._id;
    const candidateUserDoc = await User.findOneById(userId);

    if(candidateUserDoc) {
        const queryBody = req.body;
        let candidateUpdate = {}
        if (queryBody.country) candidateUpdate['candidate.locations'] = queryBody.country;
        if (queryBody.roles) candidateUpdate['candidate.roles'] = queryBody.roles;
        if (queryBody.interest_areas) candidateUpdate['candidate.interest_areas'] = queryBody.interest_areas;
        if (queryBody.base_currency) candidateUpdate['candidate.expected_salary_currency'] = queryBody.base_currency;
        if (queryBody.expected_salary) candidateUpdate['candidate.expected_salary'] = queryBody.expected_salary;
        if (queryBody.availability_day) candidateUpdate['candidate.availability_day'] = queryBody.availability_day;
        if (queryBody.current_salary) candidateUpdate['candidate.current_salary'] = queryBody.current_salary;
        if (queryBody.current_currency) candidateUpdate['candidate.current_currency'] = queryBody.current_currency;

        await User.update({ _id: userId },{ $set: candidateUpdate });
        res.send({
            success : true
        })
    }
    else {
        errors.throwError("Candidate account not found", 404);
    }
}

