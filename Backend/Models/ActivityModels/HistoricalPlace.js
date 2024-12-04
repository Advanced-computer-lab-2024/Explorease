const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistoricalPlaceSchema = new Schema({
    Name : {type : String, required : true},
    Description: { type: String, required: true },
    Location: { type: String, required: true },
    OpeningHours: { type: String, required: true },
    ClosingHours: { type: String, required: true },
    TicketPrices: {
        foreigner: { type: Number, required: true },
        native: { type: Number, required: true },
        student: { type: Number, required: true }
    },
    imageUrl : {type : String, required: false},
    Period: { type: String, required: true },
    managedBy: { type: Schema.Types.ObjectId, ref: 'TourismGovernor', required: true },
    tags: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'PreferenceTag',
        
        message: 'Invalid tag. Allowed tags are Monument, Museum, Religious Site, Palace/Castle.'
        
    }],
    imageUrl: {type : String, default : false}
}, { timestamps: true });

const HistoricalPlace = mongoose.model('HistoricalPlace', HistoricalPlaceSchema);
module.exports = HistoricalPlace;
