/**
 * Token model - persist Google OAuth tokens (simple demo storage)
 *
 * WARNING: For production, secure tokens with encryption and rotate secrets.
 */

const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: Number
});

module.exports = mongoose.model('Token', TokenSchema);
