import { Customer } from "../types/customers";

export const ITEMS_PER_PAGE = 4;
 
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    email: 'budisantoso@gmail.com',
    phone: '(+62) 851-0123-456',
    avatar: 'BS',
    avatarColor: 'bg-blue-500',
    totalOrders: 48,
    status: 'member',
    joinDate: '2023-01-15',
    totalSpent: 2400
  },
  {
    id: '2',
    name: 'Siska Amelia',
    email: 'siska.amelia@gmail.com',
    phone: '(+62) 812-3456-789',
    avatar: 'SA',
    avatarColor: 'bg-orange-500',
    totalOrders: 12,
    status: 'guest',
    joinDate: '2024-02-20',
    totalSpent: 450
  },
  {
    id: '3',
    name: 'Doni Pratama',
    email: 'doni.pratama@gmail.com',
    phone: '(+62) 876-5432-109',
    avatar: 'DP',
    avatarColor: 'bg-purple-500',
    totalOrders: 104,
    status: 'member',
    joinDate: '2022-06-10',
    totalSpent: 5200
  },
  {
    id: '4',
    name: 'Lestari Putri',
    email: 'lestari.putri@gmail.com',
    phone: '(+62) 812-3456-789',
    avatar: 'LP',
    avatarColor: 'bg-green-500',
    totalOrders: 3,
    status: 'guest',
    joinDate: '2024-01-05',
    totalSpent: 150
  },
  {
    id: '5',
    name: 'Ronggo Nur Maliki',
    email: 'ronggo.nur.maliki@gmail.com',
    phone: '(+62) 812-3456-789',
    avatar: 'RM',
    avatarColor: 'bg-indigo-500',
    totalOrders: 28,
    status: 'guest',
    joinDate: '2024-03-10',
    totalSpent: 890
  }
];