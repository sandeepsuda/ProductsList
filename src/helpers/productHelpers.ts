// Product and category helpers for ProductsList

export const getStatus = (qty: number) => {
  if (qty < 15) return { label: 'Low Stock', class: 'status-low' };
  if (qty <= 30) return { label: 'Medium', class: 'status-med' };
  return { label: 'In Stock', class: 'status-high' };
};

const CATEGORIES = ['Electronics', 'Accessories', 'Audio', 'Office'];
export const getMockCategory = (id: number, name: string): string => {
  if (
    name.toLowerCase().includes('laptop') ||
    name.toLowerCase().includes('monitor') ||
    name.toLowerCase().includes('smartphone')
  )
    return 'Electronics';
  if (
    name.toLowerCase().includes('headphones') ||
    name.toLowerCase().includes('speaker')
  )
    return 'Audio';
  if (
    name.toLowerCase().includes('keyboard') ||
    name.toLowerCase().includes('mouse')
  )
    return 'Accessories';
  return CATEGORIES[id % CATEGORIES.length];
};
