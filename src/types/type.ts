// src/types.ts

/**
 * @description 房源租赁状态枚举
 * @readonly
 */
export enum RentalStatus {
  Active = 'active',       // 租赁中
  Expired = 'expired',     // 已到期
  Upcoming = 'upcoming'    // 即将入住
}

/**
 * @description 房源标签类型（可根据业务扩展具体标签）
 * @type
 */
export type PropertyTag = '近地铁' | '带阳台' | '精装修' | '独立卫浴' | '南北通透' | '学区房' | string;

/**
 * @description 房源租赁信息接口
 * @interface
 */
export interface RentalProperty {
  id: string;                     // 房源唯一标识
  title: string;                  // 房源标题（如："阳光花园 2室1厅"）
  address: string;                // 房源地址（如："北京市朝阳区阳光花园小区8栋1203"）
  rent: number;                   // 租金（元/月）
  area: number;                   // 面积（平方米）
  bedrooms: number;               // 房间数
  image: string;                  // 房源图片地址（URL）
  startDate: string;              // 起租日期（YYYY-MM-DD格式）
  endDate: string;                // 到期日期（YYYY-MM-DD格式）
  status: RentalStatus;           // 租赁状态（使用枚举值）
  tags: PropertyTag[];            // 房源标签数组
  landlord: string;               // 房东姓名
  landlordPhone: string;          // 房东联系电话
}