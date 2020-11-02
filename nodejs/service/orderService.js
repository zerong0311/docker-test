const db = require('../models')
const Order = db.order;
const orderService = {
    findOne :async (orderID)=>{
        console.log(`finding with ${orderID}`);
        const findOneResult = await Order.findOne({
            where:{order_id:orderID}
        });
        return findOneResult;
    },
    findAll :async (limit,offset)=>{
        const findAllResult = await Order.findAll({
            limit : limit,
            offset : offset,
            attributes: ['order_id','distance','order_status']
          })
        return findAllResult;
    },
    create:async (START_LATITUDE,START_LONGITUDE,END_LATITUDE,END_LONGITUDE,distance)=>{
        const createResult = await Order.create({
            START_LATITUDE:START_LATITUDE,
            START_LONGITUDE:START_LONGITUDE,
            END_LATITUDE:END_LATITUDE,
            END_LONGITUDE:END_LONGITUDE,
            distance:distance
        })
        return createResult;
    },
    update:async(updateThings,condition)=>{
        const updateResult = await Order.update(updateThings,condition);
        return updateResult;
    }
};

module.exports = orderService