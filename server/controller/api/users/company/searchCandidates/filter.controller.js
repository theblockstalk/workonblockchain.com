const settings = require('../../../../../settings');
var Q = require('q');
const users = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const logger = require('../../../../services/logger');

module.exports = function (req,res)
{
    filter(req.body).then(function (err, data)
    {
        if (data)
        {
            res.json(data);
        }
        else
        {
            res.send(err);
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function filter(params)
{
    var result_array = [];
    var query_result=[];
    var query;

    //console.log(params);

    if(params.currency== '$ USD' && params.salary)
    {
        var result = expected_salary_converter(params.salary, USD.GBP , USD.Euro );
        //console.log(result);
        result_array= {USD : params.salary , GBP : result[0] , Euro :result[1]};
        //console.log(result_array.length);

    }

    if(params.currency== '£ GBP' && params.salary)
    {
        var result = expected_salary_converter(params.salary, GBP.USD , GBP.Euro );
        result_array= {USD : result[0] , GBP : params.salary , Euro :result[1]};
        //console.log(result_array.length);
        //console.log(result);
    }
    if(params.currency== '€ EUR' && params.salary)
    {
        var result = expected_salary_converter(params.salary, Euro.USD , Euro.GBP );
        //console.log(result);
        result_array= {USD : result[0] , GBP : result[1]  , Euro : params.salary};
        //console.log(result_array.length);
    }

    var deferred = Q.defer();



    users.find({type : 'candidate' , is_verify :1, is_approved :1, disable_account : false   }, function (err, data)
    {

        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(data)
        {
            var array = [];
            data.forEach(function(item)
            {
                array.push(item._id);
            });

            let queryString = [];


            const usersToSearch = { "_creator": {$in: array}};
            queryString.push(usersToSearch);



            if(params.position )
            {
                const rolesFilter = { "roles": {$in: params.position}};
                queryString.push(rolesFilter);

            }


            if(params.skill !== -1 )
            {
                const skillsFilter = {"programming_languages.language" :  params.skill};
                queryString.push(skillsFilter);

            }


            if(params.location !== -1)
            {
                const locationFilter = { "country": params.location };
                queryString.push(locationFilter);

            }

            if(params.blockchain)
            {
                const platformFilter = { $or: [
                        {"commercial_platform.platform_name": {$in: params.blockchain}},
                        {"platforms.platform_name": {$in: params.blockchain}}
                    ] };
                queryString.push(platformFilter);

            }

            if(params.availability!==-1)
            {
                const availabilityFilter = { availability_day: params.availability };
                queryString.push(availabilityFilter);

            }

            if(result_array.length !== 0)
            {
                //console.log("result array");
                const searchFilter = {
                    $or : [
                        { $and : [ { expected_salary_currency : "$ USD" }, { expected_salary : {$lte: result_array.USD} } ] },
                        { $and : [ { expected_salary_currency : "£ GBP" }, { expected_salary : {$lte: result_array.GBP} } ] },
                        { $and : [ { expected_salary_currency : "€ EUR" }, { expected_salary : {$lte: result_array.Euro} } ] }
                    ]
                };
                queryString.push(searchFilter);
            }

            if(params.word)
            {

                const wordSearchWhyWork = { why_work: {'$regex' : params.word , $options: 'i'  }};
                const wordSearchDescription = { description : {'$regex' : params.word , $options: 'i' } };

                const wordSearch = { $or: [{ why_work: {'$regex' : params.word , $options: 'i'  }} , { description : {'$regex' : params.word , $options: 'i' } }] };

                queryString.push(wordSearch);

            }


            const searchQuery = { $and: queryString };

            CandidateProfile.find(searchQuery).populate('_creator').exec(function(err, result)
            {


                if (err){
                    logger.error(err.message, {stack: err.stack});
                    //console.log(err);//deferred.reject(err.name + ': ' + err.message);
                }
                if(result)
                {
                    deferred.resolve(result);
                }

            });
        }

        else
        {
            deferred.reject("Not Found Any Data");
        }

    });


    return deferred.promise;
}

function expected_salary_converter(salary_value, currency1, currency2)
{
    var value1 = (currency1 * salary_value).toFixed();
    var value2 = (currency2 * salary_value).toFixed();
    var array = [];

    array.push(value1);
    array.push(value2);

    return array;

}