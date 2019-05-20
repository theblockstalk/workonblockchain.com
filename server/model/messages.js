const mongoose = require('mongoose');
const regexes = require('./regexes');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender_id:
    {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    receiver_id:
    {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },

    msg_tag:
    {
        type:String,
        enum: enumerations.chatMsgTypes,
        required: true
    },
    date_created:
    {
        type: Date,
        required: true
    },
    message: {
        file: {
            type: new Schema({
                url: {
                    type: String,
                    required: true,
                    validate: regexes.url
                }
            }),
            required: false
        },
        normal: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },
        //DELETE ME
        job_offer: {
            type: new Schema({
                title: {
                    type: String,
                    required: true
                },
                salary: {
                    type: Number,
                    required: true
                },
                salary_currency: {
                    type: String,
                    enum: enumerations.currencies,
                    required: true
                },
                type: {
                    type: String,
                    enum: enumerations.employmentTypes,
                    required: true
                },
                location: {
                    type: String,
                    required: false
                },
                description: {
                    type: String,
                    required: false
                }
            }),
            required: false
        },
        //DELETE ME
        job_offer_accepted: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },
        //DELETE ME
        job_offer_rejected: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },
        approach: {
            type: new Schema({
                employee: {
                    type: {
                        job_title: {
                            type: String,
                            required: true
                        },
                        annual_salary: {
                            min: {
                                type: Number,
                                required: true
                            },
                            max: Number
                        },
                        currency: {
                            type: String,
                            enum: enumerations.currencies,
                            required: true
                        },
                        employment_type: {
                            type: String,
                            enum: enumerations.employmentTypes,
                            required: true
                        },
                        location: {
                            type: String,
                            required: false
                        },
                        employment_description: {
                            type: String,
                            maxlength: 3000,
                            required: false
                        }
                    }
                },
                contractor: {
                    type: {
                        hourly_rate: {
                            min : {
                                type: Number,
                                required: true
                            },
                            max: Number
                        },
                        currency: {
                            type: String,
                            enum: enumerations.currencies,
                            required: true
                        },
                        role: {
                            type: String,
                            enum: enumerations.workRoles
                        },
                        contract_description: {
                            type: String,
                            maxlength: 3000,
                            required: false
                        },
                        location: {
                            type: String,
                            required: false
                        }
                    }
                },
                volunteer: {
                    type: {
                        opportunity_description: {
                            type: String,
                            maxlength: 3000,
                            required: false
                        },
                        location: {
                            type: String,
                            required: false
                        }
                    }
                }
            }),
            required: false
        },

        approach_accepted: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },

        approach_rejected: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },

        interview_offer: {
            type: new Schema({
                location: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: false
                },
                date_time: {
                    type: Date,
                    required: true
                }
            }),
            required: false
        },
        employment_offer: {
            type: new Schema({
                title: {
                    type: String,
                    required: true
                },
                salary: {
                    type: Number,
                    required: true
                },
                salary_currency: {
                    type: String,
                    enum: enumerations.currencies,
                    required: true
                },
                type: {
                    type: String,
                    enum: enumerations.jobTypes,
                    required: true
                },
                start_date: {
                    type: Date,
                    required: true
                },
                description: {
                    type: String,
                    required: false
                },
                file_url: {
                    type: String,
                    validate: regexes.url,
                    required: false
                }
            }),
            required: false
        },
        employment_offer_accepted: {
            type: new Schema({
                employment_offer_message_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Messages',
                    required: false
                },
                message: {
                    type: String,
                    required: false
                }
            }),
            required: false
        },
        employment_offer_rejected: {
            type: new Schema({
                employment_offer_message_id: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Messages'
                },
                message: {
                    type: String,
                    required: false
                }
            }),
            required: false
        }
    }
});

module.exports = mongoose.model('Messages',MessageSchema);