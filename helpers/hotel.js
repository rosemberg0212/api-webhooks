const hotelId = (hotel) => {
    let hotel_id;

    switch (hotel) {
        case '3162':
            hotel_id = 9
            return hotel_id

        case '3164':
            hotel_id = 6
            return hotel_id

        case '3166':
            hotel_id = 1
            return hotel_id

        case '3168':
            hotel_id = 7
            return hotel_id

        case '5094':
            hotel_id = 5
            return hotel_id

        case '3170':
            hotel_id = 4
            return hotel_id

        case '3178':
            hotel_id = 3
            return hotel_id

        case '3180':
            hotel_id = 10
            return hotel_id

        case '3182':
            hotel_id = 8
            return hotel_id

        case '3184':
            hotel_id = 2
            return hotel_id
        default:
            return 'Hotel no valido o no esta registrado en sistema';
    }
}

module.exports = {
    hotelId
}