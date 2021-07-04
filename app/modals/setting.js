var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model(
    'Setting',
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        whatsapp_update: {
            type: Boolean,
            default: false,
        },
        email_update: {
            type: Boolean,
            default: false,
        },
        sms_update: {
            type: Boolean,
            default: false,
        },
        general_update: {
            type: Boolean,
            default: false,
        },
    }, {
        timestamps: true,
        collection: 'Setting',
    })
);