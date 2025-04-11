const { getFarmers } = require('../services/farmer.service');

const getAllFarmers = async(req, res, next) => {
    try{
        const farmers = await getFarmers();
        res.status(200).json(farmers);
    }catch(err){
        next(err);
    }
}

module.exports = { getAllFarmers };