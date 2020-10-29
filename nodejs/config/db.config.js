module.exports = {
    HOST: process.env.DBHOST || 'db' ,
    USER: process.env.DBUSER || "zerongjob",
    PASSWORD: process.env.DBPASSWORD || "12345678",
    DB: process.env.DBNAME ||  "zerongjob",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
