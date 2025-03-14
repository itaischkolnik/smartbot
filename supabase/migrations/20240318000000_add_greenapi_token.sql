-- Add greenapi_instance_token column to chatbots table
ALTER TABLE chatbots ADD COLUMN greenapi_instance_token VARCHAR;

-- Add whatsapp_status and whatsapp_qr columns if they don't exist
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS whatsapp_status VARCHAR;
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS whatsapp_qr TEXT; 