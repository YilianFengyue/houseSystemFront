// src/api/houseApi.ts
import axios from 'axios';

// 假设你的 vite.config.ts 中有代理设置 /sdApi 到你的 Flask 后端
const API_BASE_URL = 'http://localhost:5000/houseinfo'; // 对应 @house_info_bp.route('/')

export interface HouseFilters {
  page?: number;
  per_page?: number;
  region?: string; // 经前端 join(',') 处理后的字符串
  block?: string;
  community?: string; // 主搜索框内容
  rooms?: string; // 经前端 join(',') 处理后的字符串
  min_price?: number;
  max_price?: number;
  rent_type?: string; // '整租' 或 '合租'
  subway?: number; // 后端期望 0 或 1
  decoration?: string;
  available?: number; // 后端期望 0 或 1
  orientation?: string; // 经前端 join(',') 处理后的字符串
}

export interface HouseInfo {
  id: number;
  title: string;
  // address: string; // 示例数据使用 region, block, community
  region: string;
  block: string | null; // 后端可能返回 null
  community: string;
  rooms: string;
  area: number;
  price: number;
  rent_type: string;
  publish_time: string;
  image_url?: string;
  description?: string;
  floor?: string;
  total_floors?: number;
  direction: string; // 房屋朝向
  subway?: number; // 0 或 1
  decoration?: string;
  available?: number; // 0 或 1
  contact_person?: string;
  contact_phone?: string;
  features?: string[];
  tag_new?: number; // 新上房源标记, 0 或 1
  landlord?: string; // 房东或公寓名
  // 以下字段根据您的示例数据补充，如果不需要可以移除
  house_num?: string;
  page_views?: string;
  phone_num?: string;
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
    const paramsToSend: any = { ...filters };

    // 移除值为 undefined 或空字符串的筛选条件，避免发送无效参数
    // (此步骤已在 HouseList.vue 的 loadHouses 中处理，此处是双重保险或如果直接调用此API)
    Object.keys(paramsToSend).forEach(key => {
      const k = key as keyof HouseFilters;
      if (paramsToSend[k] === undefined || paramsToSend[k] === '') {
        delete paramsToSend[k];
      }
    });

    const response = await axios.get<any>(`${API_BASE_URL}/`, {
      params: paramsToSend,
    });

    if (response.data && response.data.code === 200 && response.data.success === true) {
      return response.data.data as PaginatedHouseResponse;
    } else {
      console.error("Error fetching houses:", response.data.message || 'Unknown error from API');
      return { items: [], total: 0, page: filters.page || 1, per_page: filters.per_page || 10, pages: 0 };
    }
  } catch (error) {
    console.error('Network error fetching houses:', error);
    // 可以在这里抛出错误或使用全局错误处理
    return { items: [], total: 0, page: filters.page || 1, per_page: filters.per_page || 10, pages: 0 };
  }
};

export const fetchHouseById = async (id: number): Promise<HouseInfo | null> => {
  try {
    const response = await axios.get<any>(`${API_BASE_URL}/${id}`);
    if (response.data && response.data.code === 200 && response.data.success === true) {
      return response.data.data as HouseInfo;
    } else {
      console.error(`Error fetching house ${id}:`, response.data.message || 'Unknown error from API');
      return null;
    }
  } catch (error) {
    console.error(`Network error fetching house ${id}:`, error);
    return null;
  }
}