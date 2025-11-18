ALTER TABLE t_p13383533_copy_simple_app.users 
ADD COLUMN avatar VARCHAR(50) DEFAULT 'boy';

CREATE TABLE t_p13383533_copy_simple_app.withdrawals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p13383533_copy_simple_app.users(id),
    amount DECIMAL(10, 2) NOT NULL,
    card_id INTEGER REFERENCES t_p13383533_copy_simple_app.cards(id),
    status VARCHAR(20) DEFAULT 'pending',
    yukassa_payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_withdrawals_user_id ON t_p13383533_copy_simple_app.withdrawals(user_id);