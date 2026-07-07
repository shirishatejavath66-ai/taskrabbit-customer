const db = require('../config/db');


// =====================
// 1. CATEGORIES
// =====================
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// =====================
// 2. SUBCATEGORIES
// =====================
exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM subcategories WHERE category_id = ?',
      [categoryId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// =====================
// 3. SERVICES
// =====================
exports.getServices = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM services WHERE subcategory_id = ?',
      [subcategoryId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// =====================
// 4. SERVICE DETAILS

exports.getServiceById = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM services WHERE service_id = ?',
      [serviceId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =====================
// 5. SERVICE PROVIDERS
// =====================
exports.getProvidersByService = async (req, res) => {

    console.log('NEW PROVIDER FUNCTION RUNNING');

  const { serviceId } = req.params;

  try {

    const [rows] = await db.query(
      `SELECT DISTINCT
          sp.provider_id,
          sp.name,
          sp.phone,
          sp.email,
          sp.rating,
          sp.experience
       FROM service_providers sp
       JOIN provider_services ps
         ON sp.provider_id = ps.provider_id
       WHERE ps.service_id = ?`,
      [serviceId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};