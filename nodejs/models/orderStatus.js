const orderStatus = {
    ENUM :{
        'UNASSIGN':0,
        'TAKEN':1,
        'OTHERS':2
    },
    toString: function(num){
        for (var k in orderStatus.ENUM) {
            console.log(`orderStatus.toString ${orderStatus.ENUM[k]}  ${num}  ${orderStatus.ENUM[k] == num}`)
            if (orderStatus.ENUM[k] == num)
                return k;
        }
        return null;
    }
};


module.exports = orderStatus;

