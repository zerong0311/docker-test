module.exports = (sequelize, Sequelize) => {
    const order = sequelize.define("lala_order", {
      order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      START_LATITUDE: {
        type: Sequelize.STRING,
        allowNull: false
      },
      START_LONGITUDE: {
        type: Sequelize.STRING,
        allowNull: false
      },
      END_LATITUDE: {
        type: Sequelize.STRING,
        allowNull: false
      },
      END_LONGITUDE: {
        type: Sequelize.STRING,
        allowNull: false
      },
      distance:{
        type: Sequelize.DOUBLE,
        allowNull: true,
        comment: "db design is ready for get distance later"
      },
      order_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue : 0,
        comment: "0 : UNASSIGNED , 1 : TAKEN ..."
      },
      stamp_created:false,
      stamp_updated:false,
    },{
      freezeTableName: true,
      timestamps: false
    });
  
    return order;
  };