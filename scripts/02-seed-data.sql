-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, category, team, sizes, images, is_on_sale, rating, review_count, stock_quantity) VALUES
('Lakers #23 LeBron James Jersey', 'Official NBA Lakers jersey featuring LeBron James #23. Made with premium materials for comfort and durability.', 89.99, 119.99, 'basketball', 'Los Angeles Lakers', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], true, 4.8, 156, 25),

('Warriors #30 Stephen Curry Jersey', 'Golden State Warriors official jersey featuring Stephen Curry #30. Perfect for game day or casual wear.', 94.99, null, 'basketball', 'Golden State Warriors', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], false, 4.9, 203, 18),

('Cowboys #4 Dak Prescott Jersey', 'Dallas Cowboys official NFL jersey featuring Dak Prescott #4. Show your team spirit with this authentic jersey.', 79.99, null, 'football', 'Dallas Cowboys', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], false, 4.7, 89, 32),

('Patriots #12 Tom Brady Jersey', 'New England Patriots legendary Tom Brady #12 jersey. A must-have for any Patriots fan.', 99.99, 129.99, 'football', 'New England Patriots', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], true, 4.9, 312, 15),

('Yankees #99 Aaron Judge Jersey', 'New York Yankees Aaron Judge #99 jersey. Official MLB merchandise with premium quality.', 84.99, null, 'baseball', 'New York Yankees', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], false, 4.6, 127, 28),

('Dodgers #50 Mookie Betts Jersey', 'Los Angeles Dodgers Mookie Betts #50 jersey. Perfect for baseball fans and collectors.', 79.99, null, 'baseball', 'Los Angeles Dodgers', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], false, 4.5, 98, 22),

('Manchester United #7 Cristiano Ronaldo Jersey', 'Manchester United Cristiano Ronaldo #7 jersey. Official Premier League merchandise.', 89.99, null, 'soccer', 'Manchester United', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], false, 4.8, 245, 19),

('Barcelona #10 Lionel Messi Jersey', 'FC Barcelona legendary Lionel Messi #10 jersey. A classic piece for any soccer fan.', 94.99, 114.99, 'soccer', 'FC Barcelona', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'], true, 4.9, 387, 12);

-- Create an admin user profile (you'll need to sign up first, then update the role)
-- This is just a placeholder - you'll need to update this with your actual user ID after signing up
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@jerseystore.com';
