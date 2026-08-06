-- Seed Data SQL for SID Events (South Indian Wedding Planner & Event Management)

-- 1. Service Categories
INSERT INTO service_categories (id, name, description, display_order) VALUES
('decoration', 'Stage & Mandapam Decoration', 'Authentic traditional flower & brass setups', 1),
('food', 'Catering & Banana Leaf Feast', 'Royal traditional Sadhya and fusion buffets', 2),
('photography', 'Cinematic Photography & Film', 'High-definition 4K photography and drone coverage', 3),
('makeup', 'Bridal Makeup & Hair Styling', 'Traditional Kanchipuram drape & HD airbrush makeup', 4),
('purohit', 'Vedic Purohit Services', 'Auspicious Muhurtham rites & Samagri management', 5),
('security', 'VIP Security & Bouncers', 'Professional uniformed crowd and parking management', 6),
('welcome_girls', 'Traditional Welcome Hostesses', 'Silk saree hostesses with floral Aarathi plates', 7),
('dancers', 'Cultural Performances & Troupe', 'Live Chenda Melam, Dollu Kunitha & Bharatanatyam', 8)
ON CONFLICT (id) DO NOTHING;

-- 2. Services Catalog
INSERT INTO services (id, category, name, description, price, unit, image_url, popular) VALUES
('dec-saptapadi-mandapam', 'decoration', 'Saptapadi Royal Brass Mandapam', 'Grand traditional brass mandapam decorated with fresh jasmine & lotus.', 150000.00, 'setup', '/sid-party29.jpeg', true),
('dec-chepparam', 'decoration', 'Traditional Chepparam Mandapam Backdrop', 'Authentic temple architectural backdrop with brass lamps and golden drapes.', 85000.00, 'setup', '/wedding_destination_1_20251028.jpg', false),
('dec-nadaswaram', 'decoration', 'Live Nadaswaram & Thavil Artists', 'Traditional auspicious live Nadaswaram ensemble.', 35000.00, 'per event', '/ChatGPT Image Jul 28, 2026, 04_57_21 PM.png', true),
('food-veg-standard', 'food', 'Standard Banana Leaf Sadhya (22 Varieties)', 'Traditional authentic South Indian vegetarian meal served on fresh banana leaf.', 350.00, 'per plate', '/onam-sadhya-lunch-menu-1.webp', true),
('food-veg-gold', 'food', 'Gold Royal Sadhya (32 Varieties + Live Dosa)', 'Grand feast with payasam counters, live stalls, and welcome drinks.', 550.00, 'per plate', '/onam-sadhya-lunch-menu-1.webp', false),
('photo-candid-gold', 'photography', '4K Cinematic Candid & Drone Reel Package', '2 Candid Photographers, 2 Cinematographers, Drone Reels & Karizma Album.', 180000.00, 'package', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80', true),
('makeup-bride-hd', 'makeup', 'Royal HD Airbrush Bridal Styling', 'HD Airbrush makeup, Saree pleating, hair accessories & trial session.', 25000.00, 'per session', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', false),
('purohit-vedic', 'purohit', 'Complete Vedic Samagri & Muhurtham Purohit', 'Experienced Vedic Pandit for all rituals from Nandi to Saptapadi with complete samagri.', 30000.00, 'package', '/ChatGPT Image Jul 28, 2026, 11_34_17 AM.png', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Standard Wedding Packages
INSERT INTO wedding_packages (id, name, tagline, tier, base_price, guest_capacity, description, is_popular) VALUES
('pkg-silver', 'Silver Heritage Package', 'Intimate Elegance', 'silver', 350000.00, 300, 'Ideal for 300 guests including essential mandapam and feast.', false),
('pkg-gold', 'Gold Royalty Package', 'Our Most Popular Choice', 'gold', 650000.00, 600, 'Comprehensive luxury setup for 600 guests.', true),
('pkg-diamond', 'Diamond Sovereign Package', 'Opulent Grandeur', 'diamond', 1200000.00, 1000, 'Unmatched luxury for up to 1000 guests.', false),
('pkg-royal', 'Royal Samrat Bespoke', 'Regal Palace Level', 'royal', 2200000.00, 1500, 'Bespoke palace-level celebration with infinite customization.', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Sample Quotations
INSERT INTO quotations (id, customer_name, customer_email, customer_phone, wedding_date, venue_city, builder_state, price_breakdown, status) VALUES
('BK-8492', 'Aditya & Soundarya', 'aditya.h@gmail.com', '+91 98452 12345', '2026-11-18', 'Davanagere', '{"guestCount": 800, "notes": "Banana leaf Sadhya & Chenda Melam required"}'::jsonb, '{"estimatedCost": 385000}'::jsonb, 'Pending'),
('BK-7319', 'Karthik & Ananya', 'karthik.a@yahoo.com', '+91 97411 98765', '2026-12-05', 'Chitradurga', '{"guestCount": 500, "notes": "Nadaswaram troupe needed"}'::jsonb, '{"estimatedCost": 245000}'::jsonb, 'Contacted'),
('BK-6104', 'Pujitha & Siddharth', 'pujitha.sid@gmail.com', '+91 99002 34567', '2027-01-14', 'Shivamogga', '{"guestCount": 1200, "notes": "Drone video & full floral entrance"}'::jsonb, '{"estimatedCost": 650000}'::jsonb, 'Confirmed')
ON CONFLICT (id) DO NOTHING;

-- 5. Sample Bookings
INSERT INTO bookings (id, quotation_id, customer_name, email, phone, wedding_date, venue, guest_count, total_amount, advance_paid, payment_status, booking_status) VALUES
('BKG-1001', 'BK-6104', 'Pujitha & Siddharth', 'pujitha.sid@gmail.com', '+91 99002 34567', '2027-01-14', 'Royal Palace Convention Centre, Shivamogga', 1200, 650000.00, 100000.00, 'advance_received', 'confirmed'),
('BKG-1002', 'BK-7319', 'Karthik & Ananya', 'karthik.a@yahoo.com', '+91 97411 98765', '2026-12-05', 'Kamana Bhavana, Davanagere', 500, 245000.00, 50000.00, 'advance_received', 'confirmed')
ON CONFLICT (id) DO NOTHING;

-- 6. Google Client Testimonials
INSERT INTO testimonials (id, couple_names, wedding_date, location, rating, comment, image_url) VALUES
('test-1', 'Supraja Suppi', 'Wedding Event', 'Google Review • Davanagere', 5, 'Thank you S I D Events for making my special day more beautiful... I didn''t feel even once it as events because your involvement in my marriage is like your own sister''s marriage!', ''),
('test-2', 'Ranganath K.B', 'Local Guide Review', 'Google Review • Davanagere', 5, 'The experience with SID EVENT MANAGEMENT was beyond expectations. Quality materials, excellent and in-time work, tasty food is the ultimate thing of this event and reasonable price!', ''),
('test-3', 'Moksha M', 'Local Guide Review', 'Google Review • Davanagere', 5, 'Hello SID Events, you guys are the best in every event you have done! Including my marriage, it was beyond expectations for me and my entire family.', '')
ON CONFLICT (id) DO NOTHING;
