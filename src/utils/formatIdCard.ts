// 修改 formatIdCard 工具函数，使其在显示模式下，显示前3位 + 12个* + 后4位的格式
export const formatIdCard = (idCard) => {
  if (!idCard) return '';
  
  // 如果是编辑模式，直接返回原始值（不添加星号）
  if (idCard.length < 18) {
    return idCard;
  }
  
  // 显示模式：前3位 + 12个* + 后4位
  return `${idCard.substring(0, 3)}${'*'.repeat(12)}${idCard.substring(15)}`;
};