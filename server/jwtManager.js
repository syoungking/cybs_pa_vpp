const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// 生成FIDO_INIT请求的JWT
const generateFidoInitJWT = (config) => {
  try {
    // 生成请求UUID
    const jti = uuidv4();
    // 获取当前时间戳（秒级）
    const iat = Math.floor(Date.now() / 1000);
    
    // JWT Header
    const header = {
      typ: 'JWT',
      alg: 'HS256'
    };
    
    // JWT Payload
    const payload = {
      iss: config.JWT_API_KEY_ID,
      jti: jti,
      iat: iat,
      OrgUnitId: config.JWT_ORG_UNIT_ID,
      ReturnUrl: config.RETURN_URL,
      ObjectifyPayload: true,
      Payload: {
        MerchantOrigin: config.MERCHANT_ORIGIN
      }
    };
    
    // 生成JWS（签名）
    const jws = jwt.sign(payload, config.JWT_SECRET, { header: header });
    
    return {
      jws: jws,
      payload: payload,
      jti: jti
    };
  } catch (error) {
    console.error('生成JWT失败:', error);
    throw error;
  }
};

// 验证JWT应答
const verifyJWT = (jws, secret) => {
  try {
    // 验签
    const decoded = jwt.verify(jws, secret);
    return decoded;
  } catch (error) {
    console.error('JWT验签失败:', error);
    throw error;
  }
};

// 解析JWT应答Payload
const parseJWTResponse = (decoded) => {
  try {
    return {
      iss: decoded.iss,
      iat: decoded.iat,
      exp: decoded.exp,
      jti: decoded.jti,
      aud: decoded.aud,
      Payload: decoded.Payload
    };
  } catch (error) {
    console.error('解析JWT应答失败:', error);
    throw error;
  }
};

module.exports = {
  generateFidoInitJWT,
  verifyJWT,
  parseJWTResponse
};