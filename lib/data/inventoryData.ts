export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type SupplyCategory = 'Chemicals' | 'Packaging' | 'Essentials' | 'Equipment';

export interface SupplyItem {
  id: number;
  name: string;
  subtitle: string;
  category: SupplyCategory;
  quantity: number;
  unit: string;
  status: StockStatus;
  minStock: number;
  maxStock: number;
  monthlyUsage: number;
  pricePerUnit: number; // in IDR
  lastRestocked: string;
}

export const supplyItems: SupplyItem[] = [
  {
    id: 1,
    name: 'Premium Detergent',
    subtitle: 'HE Liquid - 20L Drums',
    category: 'Chemicals',
    quantity: 12,
    unit: 'Units',
    status: 'In Stock',
    minStock: 5,
    maxStock: 30,
    monthlyUsage: 8,
    pricePerUnit: 185000,
    lastRestocked: '2025-04-14',
  },
  {
    id: 2,
    name: 'Fabric Softener',
    subtitle: 'Lavender Scent - 10L',
    category: 'Chemicals',
    quantity: 2,
    unit: 'Units',
    status: 'Low Stock',
    minStock: 4,
    maxStock: 20,
    monthlyUsage: 6,
    pricePerUnit: 95000,
    lastRestocked: '2025-03-28',
  },
  {
    id: 3,
    name: 'Plastic Bags',
    subtitle: 'Eco-Friendly Large (500ct)',
    category: 'Packaging',
    quantity: 45,
    unit: 'Rolls',
    status: 'In Stock',
    minStock: 10,
    maxStock: 60,
    monthlyUsage: 15,
    pricePerUnit: 32000,
    lastRestocked: '2025-04-10',
  },
  {
    id: 4,
    name: 'Wire Hangers',
    subtitle: 'Silver Industrial (1000ct)',
    category: 'Essentials',
    quantity: 5,
    unit: 'Boxes',
    status: 'Low Stock',
    minStock: 8,
    maxStock: 25,
    monthlyUsage: 7,
    pricePerUnit: 75000,
    lastRestocked: '2025-03-20',
  },
  {
    id: 5,
    name: 'Laundry Tags',
    subtitle: 'Waterproof Label Roll',
    category: 'Packaging',
    quantity: 20,
    unit: 'Rolls',
    status: 'In Stock',
    minStock: 5,
    maxStock: 30,
    monthlyUsage: 5,
    pricePerUnit: 28000,
    lastRestocked: '2025-04-01',
  },
  {
    id: 6,
    name: 'Stain Remover',
    subtitle: 'Heavy Duty Spray - 5L',
    category: 'Chemicals',
    quantity: 0,
    unit: 'Units',
    status: 'Out of Stock',
    minStock: 3,
    maxStock: 15,
    monthlyUsage: 4,
    pricePerUnit: 120000,
    lastRestocked: '2025-03-10',
  },
  {
    id: 7,
    name: 'Garment Covers',
    subtitle: 'Clear Poly Bags (100ct)',
    category: 'Packaging',
    quantity: 30,
    unit: 'Packs',
    status: 'In Stock',
    minStock: 8,
    maxStock: 50,
    monthlyUsage: 10,
    pricePerUnit: 45000,
    lastRestocked: '2025-04-05',
  },
  {
    id: 8,
    name: 'Washing Machine Cleaner',
    subtitle: 'Descaler Tablets (24ct)',
    category: 'Equipment',
    quantity: 3,
    unit: 'Boxes',
    status: 'Low Stock',
    minStock: 5,
    maxStock: 15,
    monthlyUsage: 3,
    pricePerUnit: 65000,
    lastRestocked: '2025-03-15',
  },
];

export const inventoryStats = {
  totalItems: 124,
  totalItemsChange: '+4%',
  lowStockAlerts: 3,
  monthlySpend: 1240000,
  lastRestock: '2 days ago',
};