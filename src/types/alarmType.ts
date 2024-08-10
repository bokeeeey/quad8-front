export type AlarmType = 'COMMUNITY' | 'PRODUCT_ORDER' | 'EVENT';

export interface AlarmDataType {
  id: number;
  message: string;
  type: AlarmType;
  isRead: boolean;
  relatedId: number;
  createdAt: string;
}

export interface AlarmAPIDataType {
  count: number;
  alarmDtoList: AlarmDataType[];
}
