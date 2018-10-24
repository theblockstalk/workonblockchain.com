const Q = require('q');
const mongo = require('mongoskin');
const Pages = require('../../../../../model/pages_content');
const logger = require('../../../../services/logger');
const sanitize = require('../../../../services/sanitize');

//////////inserting message in DB ////////////

module.exports = function (req,res)
{
    let userId = req.auth.user._id;
    console.log(req.body);
	logger.info(req.body);
	const sanitizedHtml = sanitize.sanitizeHtml(req.unsanitizedBody.html_text);
    add_privacy_content(req.body, sanitizedHtml,userId).then(function (err, data)
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

function add_privacy_content(info, html_text, userId)
{
    var deferred = Q.defer();
    var createdDate;
    let now = new Date();
    createdDate= now;

    Pages.findOne({ page_name: info.page_name}, function (err, data)
    {
        
        if (err)
		{

            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(data==null)
        {
            
            insertContent();

        }

        else
        {
        
            updateContent(data._id);
        }

    });

    function updateContent(_id)
    {
      
        var set =
            {
                page_content : html_text,
                page_title : info.page_title,
                updated_by : userId,
                updated_date:createdDate,
            };

        Pages.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                deferred.resolve(set);
        });
    }

    function insertContent()
    {
        
        let add_content = new Pages
        ({
            page_title : info.page_title,
            page_content : html_text,
            page_name : info.page_name,
            updated_by : userId,
            updated_date:createdDate,

        });

        add_content.save((err,data)=>
        {
            if(err)
            {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else

            {

                deferred.resolve
                ({
                    information :data
                });
			}
		});

    }

    return deferred.promise;

}