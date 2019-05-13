const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')

module.exports = {
    getAppartments: (req, res, next) => {
        logger.info('GET /api/apartments aangeroepen!')

        logger.trace('Appartement info is opgevraagd')

        const query = `SELECT (
            SELECT *,
                (SELECT * FROM DBUser WHERE DBUser.UserId = Apartment.UserId FOR JSON PATH) AS Landlord,
                (SELECT * FROM Reservation WHERE Reservation.ApartmentId = Apartment.ApartmentId FOR JSON PATH) AS Reservations
            FROM Apartment FOR JSON PATH 
            ) AS Result`

        logger.trace(query)

        database.executeQuery(query, (err, rows) => {
            // verwerk error of result

            const resultArray = rows.recordset
            const resultObject = resultArray[0]
            const apartment = req.body;

            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                logger.warn(resultObject.Result)
                // res.status(200).json(JSON.parse(resultObject.Result))
                res.status(200).json(apartment)
            }
        });
    },

    createAppartment: (req, res, next) => {
        logger.info('POST /api/apartments aangeroepen!')

        logger.trace("Creating a new apartment into the database")
        logger.trace(req.body);

        const query = "INSERT INTO Apartment(Description, StreetAddress, PostalCode, City, UserId)" +
            "VALUES('" +
            req.body.description + "','" +
            req.body.streetAddress + "','" +
            req.body.postalCode + "','" + 
            req.body.city + "','" +
            req.body.userId + "');"

        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                res.status(200).json({
                    result: rows.recordset
                })
            }
        });
    },

    getApartmentByID: (req, res, next) => {
        logger.info('GET /api/apartments/:id aangeroepen!')

        const id = req.params.id

        const query = `SELECT (
            SELECT Apartment.ApartmentId, Apartment.Description,
                (SELECT * FROM DBUser WHERE DBUser.UserId = Apartment.UserId FOR JSON PATH) AS Landlord,
                (SELECT * FROM Reservation WHERE Reservation.ApartmentId = Apartment.ApartmentId FOR JSON PATH) AS Reservations
            FROM Apartment  WHERE Apartment.ApartmentId = ${id} FOR JSON PATH
            ) AS Result`

        logger.trace(query)

        database.executeQuery(query, (err, rows) => {
            // verwerk error of result

            const resultArray = rows.recordset
            const resultObject = resultArray[0]

            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows === null) {
                logger.warn('Result was null!')
                res.status(404).json({
                    message: 'Er was geen resultaat, resultaat is null!',
                    code: 404
                })
            } else if (rows) {
                logger.warn(resultObject.Result)
                res.status(200).json(JSON.parse(resultObject.Result))
            }
        });
    },

    updateApartmentByID: (req, res, next) => {
        logger.info('PUT /api/apartments/:id aangeroepen!')
        const id = req.params.id

        logger.trace(req.body)

        const query = `UPDATE Apartment SET Description = '${req.body.description}', 
          StreetAddress = '${req.body.streetAddress}', PostalCode = '${req.body.postalCode}',
          City = '${req.body.city}', UserId = ${req.body.userId} WHERE ApartmentId = ${id}`
        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                res.status(200).json({
                    result: rows.recordset
                })
            } else {
                const error = {
                    message: "Apartment with ID: " + id + " not found!",
                    code: 404
                }
                logger.error(error);
                next(error);
            }
        });
    },

    deleteApartmentByID: (req, res, next) => {
        logger.info('DELETE /api/apartments/:id aangeroepen!')
        const id = req.params.id

        const query = `DELETE FROM Apartment WHERE ApartmentId = ${id}`
        database.executeQuery(query, (err, rows) => {
            // verwerk error of result
            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                res.status(200).json({
                    result: rows.recordset
                })
            } else {
                const error = {
                    message: "Apartment with ID: " + id + " not found!",
                    code: 404
                }
                logger.error(error);
                next(error);
            }
        });
    }
}