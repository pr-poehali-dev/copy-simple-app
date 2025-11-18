-- Add language and inventory fields to users table
ALTER TABLE t_p13383533_copy_simple_app.users 
ADD COLUMN language VARCHAR(10) DEFAULT 'ru',
ADD COLUMN inventory JSONB DEFAULT '[]'::jsonb;

-- Add payment_card_id to users table for default payment card
ALTER TABLE t_p13383533_copy_simple_app.users
ADD COLUMN default_payment_card_id INTEGER;

-- Add comment
COMMENT ON COLUMN t_p13383533_copy_simple_app.users.language IS 'User interface language code';
COMMENT ON COLUMN t_p13383533_copy_simple_app.users.inventory IS 'JSON array of purchased items with animations';
COMMENT ON COLUMN t_p13383533_copy_simple_app.users.default_payment_card_id IS 'Default card for purchases';