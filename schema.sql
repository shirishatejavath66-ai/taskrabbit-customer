CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subcategories (
  subcategory_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  subcategory_name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
  service_id INT AUTO_INCREMENT PRIMARY KEY,
  subcategory_id INT,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  duration_hours INT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_providers (
  provider_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  experience VARCHAR(255),
  skills TEXT,
  bio TEXT,
  profile_image VARCHAR(500),
  is_available BOOLEAN DEFAULT TRUE,
  hourly_rate DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS provider_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT,
  service_id INT,
  FOREIGN KEY (provider_id) REFERENCES service_providers(provider_id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE,
  UNIQUE KEY unique_provider_service (provider_id, service_id)
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  provider_id INT,
  service_id INT,
  scheduled_date DATETIME NOT NULL,
  duration_hours INT NOT NULL,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES service_providers(provider_id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
);

-- Sample Data for Testing
INSERT INTO categories (category_name, description, image_url) VALUES
('Home Services', 'Professional home maintenance and repair services', 'https://images.unsplash.com/photo-1581578731117-104f2a8d2e9c?w=400'),
('Cleaning', 'Expert cleaning services for your home and office', 'https://images.unsplash.com/photo-1581578731117-104f2a8d2e9c?w=400'),
('Moving', 'Reliable moving and packing services', 'https://images.unsplash.com/photo-1581578731117-104f2a8d2e9c?w=400'),
('Handyman', 'Skilled handyman services for all your needs', 'https://images.unsplash.com/photo-1581578731117-104f2a8d2e9c?w=400');

INSERT INTO subcategories (category_id, subcategory_name, description) VALUES
(1, 'Plumbing', 'Professional plumbing services'),
(1, 'Electrical', 'Expert electrical work and repairs'),
(1, 'Carpentry', 'Custom carpentry and woodwork'),
(2, 'Deep Cleaning', 'Thorough deep cleaning services'),
(2, 'Regular Cleaning', 'Regular maintenance cleaning'),
(3, 'Local Moving', 'Moving within the city'),
(3, 'Long Distance', 'Moving across states'),
(4, 'Furniture Assembly', 'Assembly of furniture and fixtures'),
(4, 'General Repairs', 'General home repairs');

INSERT INTO services (subcategory_id, service_name, description, base_price, duration_hours) VALUES
(1, 'Pipe Repair', 'Fix leaking pipes and plumbing issues', 75.00, 2),
(1, 'Drain Cleaning', 'Professional drain cleaning services', 50.00, 1),
(2, 'Outlet Installation', 'Install electrical outlets safely', 40.00, 1),
(2, 'Light Fixture Installation', 'Install and repair light fixtures', 60.00, 2),
(3, 'Custom Shelves', 'Build custom shelves and storage', 120.00, 4),
(3, 'Door Repair', 'Repair and install doors', 80.00, 2),
(4, 'Whole House Cleaning', 'Complete deep cleaning of entire home', 200.00, 5),
(4, 'Kitchen Cleaning', 'Deep clean kitchen and appliances', 80.00, 2),
(5, 'Weekly Cleaning', 'Regular weekly cleaning service', 100.00, 3),
(5, 'Bi-weekly Cleaning', 'Bi-weekly cleaning maintenance', 120.00, 3),
(6, 'Studio Apartment Move', 'Moving for studio apartments', 300.00, 4),
(6, '1-2 Bedroom Move', 'Moving for 1-2 bedroom apartments', 500.00, 6),
(7, 'State to State Move', 'Long distance moving services', 1500.00, 24),
(7, 'Cross Country Move', 'Cross country relocation', 3000.00, 48),
(8, 'IKEA Furniture Assembly', 'Assembly of IKEA furniture', 50.00, 2),
(8, 'Custom Furniture Assembly', 'Assembly of custom furniture', 75.00, 3),
(9, 'Drywall Repair', 'Repair damaged drywall', 100.00, 3),
(9, 'Painting Touch-ups', 'Interior painting and touch-ups', 80.00, 3);

INSERT INTO service_providers (name, email, phone, password, rating, total_reviews, experience, skills, bio, hourly_rate) VALUES
('John Smith', 'john@tasker.com', '555-0101', '$2a$10$dummyHashForJohn12345678901234567890123456789012345678901234567890123', 4.5, 120, '10 years', 'Plumbing, Electrical', 'Experienced handyman specializing in plumbing and electrical work.', 65.00),
('Sarah Johnson', 'sarah@tasker.com', '555-0102', '$2a$10$dummyHashForSarah12345678901234567890123456789012345678901234567890123', 4.8, 200, '8 years', 'Cleaning, Organization', 'Professional cleaner with attention to detail.', 45.00),
('Mike Wilson', 'mike@tasker.com', '555-0103', '$2a$10$dummyHashForMike12345678901234567890123456789012345678901234567890123', 4.2, 85, '12 years', 'Moving, Heavy Lifting', 'Strong and reliable mover for all your needs.', 55.00),
('Emily Davis', 'emily@tasker.com', '555-0104', '$2a$10$dummyHashForEmily12345678901234567890123456789012345678901234567890123', 4.9, 150, '6 years', 'Carpentry, Furniture Assembly', 'Skilled carpenter with modern techniques.', 70.00),
('David Brown', 'david@tasker.com', '555-0105', '$2a$10$dummyHashForDavid12345678901234567890123456789012345678901234567890123', 4.6, 95, '15 years', 'General Repairs, Painting', 'Versatile handyman for all home repairs.', 60.00);

INSERT INTO provider_services (provider_id, service_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 7), (2, 8), (2, 9), (2, 10),
(3, 11), (3, 12), (3, 13), (3, 14),
(4, 15), (4, 16), (4, 5), (4, 6),
(5, 17), (5, 18), (5, 3), (5, 4);
