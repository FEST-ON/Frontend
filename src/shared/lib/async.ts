/** TanStack Query 데모용: 실제 API 호출을 흉내내기 위한 인위적 지연 */
export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
