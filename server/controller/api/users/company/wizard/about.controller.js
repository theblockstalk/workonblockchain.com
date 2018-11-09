const EmployerProfile = require('../../../../../model/employer_profile');

module.exports = async  function (req,res)
{
	let userId = req.auth.user._id;
    const employerDoc = await EmployerProfile.findOne({ _creator: userId }).lean();

    if(employerDoc){
        const companyParam = req.body;
        let employerUpdate = {};

        if (companyParam.company_founded) employerUpdate.company_founded = companyParam.company_founded;
        if (companyParam.no_of_employees) employerUpdate.no_of_employees = companyParam.no_of_employees;
        if (companyParam.company_funded) employerUpdate.company_funded = companyParam.company_funded;
        if (companyParam.company_description) employerUpdate.company_description = companyParam.company_description;

        await EmployerProfile.update({ _creator: userId },{ $set: employerUpdate });

        res.send({
            success : true
        })
    }

    else {
        res.sendStatus(404);
    }

}

