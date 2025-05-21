// src/api/houseApi.ts
import axios from 'axios';

// 假设你的 vite.config.ts 中有代理设置 /sdApi 到你的 Flask 后端
const API_BASE_URL = 'http://localhost:5000/houseinfo'; // 对应 @house_info_bp.route('/')

export interface HouseFilters {
  page?: number;
  per_page?: number;
  region?: string;
  block?: string;
  community?: string;
  rooms?: string; // 例如 "2室1厅" 或 "三居"
  min_price?: number;
  max_price?: number;
  rent_type?: string; // '整租' 或 '合租'
  subway?: boolean;
  decoration?: string;
  available?: boolean;
  // 可以添加更多筛选条件，如朝向等
  orientation?: string; // 例如 '东','南','西','北','南北'
}

export interface HouseInfo {
  id: number;
  title: string;
  address: string;
  region: string;
  block: string;
  community: string;
  rooms: string;
  area: number; // 假设是平方米
  price: number; // 月租金
  rent_type: string;
  publish_time: string;
  image_url?: string; // 假设有一个主图URL
  // ... 其他你需要的房源信息字段
  description?: string;
  floor?: string;
  total_floors?: number;
  orientation?: string;
  subway?: boolean;
  decoration?: string;
  available?: boolean;
  contact_person?: string;
  contact_phone?: string;
  features?: string[]; // 房屋特点标签
}

export interface PaginatedHouseResponse {
  items: HouseInfo[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export const fetchHouses = async (filters: HouseFilters): Promise<PaginatedHouseResponse> => {
  try {
    const response = await axios.get<any>(`${API_BASE_URL}/`, { // 确保这里的路径正确对应你的Flask蓝图
      params: filters,
    });
    
    if (response.data && response.data.code === 'GET_OK') { // Code.GET_OK 对应你后端定义的成功码
      return response.data.data;
    } else {
      // 可以根据后端返回的 message 进行错误提示
      console.error("Error fetching houses:", response.data.message);
      // 返回一个空的或者默认的 PaginatedHouseResponse 结构，防止后续代码出错
      return { items: [], total: 0, page: 1, per_page: filters.per_page || 10, pages: 0 };
    }
  } catch (error) {
    console.error('Network error fetching houses:', error);
    // 返回一个空的或者默认的 PaginatedHouseResponse 结构
    return { items: [], total: 0, page: 1, per_page: filters.per_page || 10, pages: 0 };
  }
};

export const fetchHouseById = async (id: number): Promise<HouseInfo | null> => {
  try {
    const response = await axios.get<any>(`${API_BASE_URL}/${id}`);
    if (response.data && response.data.code === 'GET_OK') {
      return response.data.data;
    } else {
      console.error(`Error fetching house ${id}:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.error(`Network error fetching house ${id}:`, error);
    return null;
  }
}