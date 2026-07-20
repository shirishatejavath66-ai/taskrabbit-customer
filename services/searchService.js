const db = require('../config/db');

const searchServices = async (keyword) => {

    const [rows] = await db.query(

        `SELECT *
         FROM services
         WHERE service_name LIKE ?`,

        [`%${keyword}%`]

    );

    return rows;

};
//Filter by Category
const filterByCategory = async(categoryId)=>{

    const [rows] = await db.query(

        `SELECT *
         FROM services
         WHERE category_id=?`,

        [categoryId]

    );

    return rows;

};

//Filter by subcatregory
const filterBySubcategory = async(subcategoryId)=>{

const [rows]=await db.query(

`SELECT *
FROM services
WHERE subcategory_id=?`,

[subcategoryId]

);

return rows;

};
//Filter by Price
const filterByPrice = async(min,max)=>{

const [rows]=await db.query(

`SELECT *
FROM services
WHERE price BETWEEN ? AND ?`,

[min,max]

);

return rows;

};
//Get Active Service.
const getActiveServices = async()=>{

const [rows]=await db.query(

`SELECT *
FROM services
WHERE is_active=1`

);

return rows;

};
module.exports={

searchServices,

filterByCategory,

filterBySubcategory,

filterByPrice,

getActiveServices

};