// 默认配置值
const defaultConfig = {
  SANDBOX_SITE: 'https://centinelapistag.cardinalcommerce.com/',
  PROD_SITE: 'https://centinelapi.cardinalcommerce.com/',
  FIDO_INIT: 'V2/FIDO/Init',
  FIDO_CHALLENGE: 'V2/FIDO/Challenge',
  JWT_API_KEY_ID: '61a79c46a8bd2d6dd6ab521a',
  JWT_ORG_UNIT_ID: '61a79c46a8bd2d6dd6ab5219',
  JWT_SECRET: 'af3aeed1-bac4-41f6-93e8-050eed0e1484',
  MERCHANT_ORIGIN: 'https://demo.sean.io',
  RETURN_URL: 'https://demo.sean.io'
};

// 内存中的配置存储
let currentConfig = { ...defaultConfig };

// 读取配置
const readConfig = () => {
  return { ...currentConfig };
};

// 写入配置（仅在当前会话中保存）
const writeConfig = (config) => {
  try {
    currentConfig = { ...config };
    return true;
  } catch (error) {
    console.error('更新配置失败:', error);
    throw error;
  }
};

// 检查配置完整性
const checkConfigComplete = () => {
  try {
    const config = readConfig();
    const requiredFields = [
      'SANDBOX_SITE', 'PROD_SITE', 'FIDO_INIT', 'FIDO_CHALLENGE',
      'JWT_API_KEY_ID', 'JWT_ORG_UNIT_ID', 'JWT_SECRET', 'MERCHANT_ORIGIN', 'RETURN_URL'
    ];
    
    for (const field of requiredFields) {
      if (!config[field]) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  readConfig,
  writeConfig,
  checkConfigComplete
};