-- Atualizar usuário para ser criador
UPDATE users 
SET user_type = 'creator', updated_at = NOW()
WHERE username = 'testuser_final2';

-- Criar perfil de criador
INSERT INTO creator_profiles (user_id, subscription_price, description, categories, total_earnings, created_at)
SELECT id, 9.99, 'Criador de conteúdo exclusivo', ARRAY['lifestyle']::text[], 9.9, NOW()
FROM users 
WHERE username = 'testuser_final2'
ON CONFLICT (user_id) DO NOTHING;

