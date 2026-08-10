export type OperationCategory = "프로그램" | "참여업체" | "부스" | "인력" | "자원봉사자";

export type OperationStatus = "준비중" | "운영중" | "완료" | "이슈";

export interface OperationResource {
  id: string;
  category: OperationCategory;
  name: string;
  manager: string;
  contact: string;
  location: string;
  time: string;
  status: OperationStatus;
  note: string;
}
