const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// const customTypes = {
//     blockchainPlatforms: {
//         type: String,
//         enum: ['Bitcoin', 'Ethereum']
//         // TODO: complete this
//     },
//     currencies: {
//         type: String,
//         enum: ['€ EUR', '$ USD', '£ GBP']
//     },
//     programmingLanguages: {
//         type: String,
//         enum: ['PHP']
//         // TODO: complete this
//     },
//     experienceYears: {
//         type: String,
//         match: /\d-\d/
//     }
// };

const CandidateProfileSchema = new Schema({
    terms:
    {
    	type:Boolean
    },
    marketing_emails:
    {
    	type:Boolean,
    	default:true
    },
    disable_account:
    {
    	type:Boolean,
    	default:false
    },
    first_name:
    {
        type:String
    },
    last_name:
    {
        type:String
    },
    github_account:
    {
        type:String
    },
    stackexchange_account:
    {
        type:String
    },
    contact_number:
    {
        type: String,
    },
    nationality:
    {
        type:String,
        // enum: ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dominican', 'Dutch', 'Dutchman', 'Dutchwoman', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'Netherlander', 'New Zealander', 'Ni-Vanuatu', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean']
    },
    image:
    {
        type:String, // URL to file
        // data: Buffer, // Not used anymore???
    },
    // gender: // Not used anymore
    // {
    //     type:String,
    // },
    country:
    {
        type: [{
            type: String,
            // enum: ['remote', 'Los Angeles']
            // // TODO: complete this
        }]
    },
    roles:
    {
        type: [{
            type: String,
            // enum: ['Backend Developer', 'Fullstack Developer']
            // // TODO: complete this
        }],
    },
    expected_salary_currency: String,
    expected_salary:
    {
        type:Number,
        // min: 0
    },
    interest_area:
    {
        type:[{
            type: String,
            // enum: ['Enterprise blockchain']
            // // TODO: complete this
        }],
    },
    availability_day:
    {
        type:String,
        // enum: ['1 month']
        // // TODO: complete this
    },
    // availability_year: // Not used???
    // {
    //     type:String,
    //
    // },
    why_work:
    {
        type:String,

    },
    commercial_platform:
    {
        type: [new Schema({
            platform_name: String,
            exp_year: String
        })]
    },
    experimented_platform:
    {
        type: [new Schema({
            experimented_platform: String,
            exp_year: String
        })]

    },
    platforms:
    {
        type: [new Schema({
            platform_name: String,
            exp_year: String
        })]
    },
    current_currency: String,
    current_salary:
    {
        type:Number,
        // min: 0
    },
    languages:
    {
        type: [new Schema({
            name: String,
            value: String,
            checked : Boolean
        })]
    },
    experience_roles:
    {
        type:[new Schema({
            platform_name: String,
            exp_year: String
        })]
    },
    // work_experience: // Are these used???
    // {
    //     type:Array,
    //
    // },
    //  work_experience_year:
    // {
    //     type:Array,
    //
    // },
    education:
    {
        type:[new Schema({
            uniname: {
                type: String,
                required: true
            },
            degreename: {
                type: String,
                required: true
            },
            fieldname: {
                type: String,
                required: true
            },
            edudate: String, // Date
            eduyear: {
                type: String, // Number
                required: true
            }
        })]
    },
    history:
    {
        type:[new Schema({
            companyname: {
                type: String,
                required: true
            },
            positionname: {
                type: String,
                required: true
            },
            locationname: {
                type: String,
                required: true
            },
            descname: String,
            startdate: {
                type: String,
                // enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                required: true
            },
            startyear: {
                type: String, // Number
                required: true
            },
            enddate: {
                type: String,
                // enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            },
            endyear: String, // Number
            currentwork: {
                type: Boolean,
                required: true
            },
            currentenddate: {
                type: String,
                // enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            },
            currentendyear: String, // Number
        })],
    },
    description:
    {
        type:String,
    },
    _creator : 
    { 
        type: String, 
        ref: 'User' 
    },

});

module.exports = mongoose.model('CandidateProfile',CandidateProfileSchema);


