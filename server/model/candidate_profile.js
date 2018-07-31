const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const CandidateProfileSchema = mongoose.Schema({
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
        enum: ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dominican', 'Dutch', 'Dutchman', 'Dutchwoman', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'Netherlander', 'New Zealander', 'Ni-Vanuatu', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean']
    },
    image: 
    { 
        type:String, // URL to file
        // data: Buffer, // Not used anymore?
    },
    // gender: // Not used anymore
    // {
    //     type:String,
    // },
    country:
    {
        type: String
    },
    roles:
    {
        type:Array,
        
    },
    expected_salary_currency:
    {
        type:String,
    },
    expected_salary:
    {
        type:Number,
        
    },
    interest_area:
    {
        type:Array,
        
    },
    availability_day:
    {
        type:String,
        
    },
    availability_year:
    {
        type:String,
        
    },
    why_work:
    {
        type:String,
        
    },
    commercial_platform:
    {
        type:Array,
        
    },
    experimented_platform:
    {
        type:Array,
        
    },
    platforms:
    {
        type:Array,
        
    },
    current_currency:
    {
        type:String,
    },
    current_salary:
    {
        type:Number,
        
    },
    languages:
    {
        type:Array,
        
    },
    experience_roles:
    {
        type:Array,
        
    },

    work_experience:
    {
        type:Array,
        
    },
     work_experience_year:
    {
        type:Array,
        
    },
    education:
    {
        type:Array,
        
    },
    history:
    {
        type:Array,
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
const CandidateProfile = module.exports = mongoose.model('CandidateProfile',CandidateProfileSchema);


