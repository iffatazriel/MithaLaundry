'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from 'react';
import type { ServiceType, PaymentMethod } from '@/types';
import { SERVICES } from '@/lib/data';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectedCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status?: string;
}

export interface OrderService {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderPayload {
  customerId: string;
  services: OrderService[];
  payment: PaymentMethod;
  itemCount: number;
  deliveryDate: string;
  isExpress: boolean;
  subtotal: number;
  expressFee: number;
  total: number;
}

export interface SavedOrder extends OrderPayload {
  id: string;
}

interface OrderContextValue {
  // Customer selection
  selectedCustomer: SelectedCustomer | null;
  setSelectedCustomer: (customer: SelectedCustomer | null) => void;

  // Service quantities
  serviceQtys: Record<ServiceType, number>;
  updateQty: (id: ServiceType, delta: number) => void;

  // Order details
  payment: PaymentMethod;
  setPayment: (method: PaymentMethod) => void;
  itemCount: string;
  setItemCount: (v: string) => void;
  deliveryDate: string;
  setDeliveryDate: (v: string) => void;
  isExpress: boolean;
  setIsExpress: (v: boolean) => void;

  // Derived / computed
  subtotal: number;
  expressCharge: number;
  grandTotal: number;
  selectedServices: typeof SERVICES;

  // Saved order (setelah submit berhasil)
  currentOrder: SavedOrder | null;
  setCurrentOrder: (order: SavedOrder | null) => void;

  // Modal state
  openCustomerModal: boolean;
  setOpenCustomerModal: (v: boolean) => void;
  showReceipt: boolean;
  setShowReceipt: (v: boolean) => void;

  // Submit
  submitOrder: () => Promise<SavedOrder>;
  resetOrder: () => void;

  // Customer list (untuk SelectCustomerModal — tidak perlu fetch ulang)
  customers: SelectedCustomer[];
  customersLoading: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const OrderContext = createContext<OrderContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const EXPRESS_FEE = 5000;

export function OrderProvider({ children }: { children: ReactNode }) {
  // Customer selection
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | null>(null);

  // Service quantities
  const [serviceQtys, setServiceQtys] = useState<Record<ServiceType, number>>(
    Object.fromEntries(SERVICES.map((s) => [s.id, 0])) as Record<ServiceType, number>
  );

  // Order details
  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [itemCount, setItemCount] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isExpress, setIsExpress] = useState(false);

  // Saved order
  const [currentOrder, setCurrentOrder] = useState<SavedOrder | null>(null);

  // Modal state
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Customer list untuk modal (fetch sekali)
  const [customers, setCustomers] = useState<SelectedCustomer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  useEffect(() => {
    setCustomersLoading(true);
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(console.error)
      .finally(() => setCustomersLoading(false));
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const selectedServices = SERVICES.filter((s) => serviceQtys[s.id] > 0);
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price * serviceQtys[s.id], 0);
  const expressCharge = isExpress ? EXPRESS_FEE : 0;
  const grandTotal = subtotal + expressCharge;

  // ── Actions ───────────────────────────────────────────────────────────────────

  const updateQty = useCallback((id: ServiceType, delta: number) => {
    setServiceQtys(prev => ({
      ...prev,
      [id]: Math.max(0, Number((prev[id] + delta).toFixed(1))),
    }));
  }, []);

  const resetOrder = useCallback(() => {
    setSelectedCustomer(null);
    setServiceQtys(
      Object.fromEntries(SERVICES.map((s) => [s.id, 0])) as Record<ServiceType, number>
    );
    setPayment('cash');
    setItemCount('');
    setDeliveryDate('');
    setIsExpress(false);
    setCurrentOrder(null);
    setShowReceipt(false);
  }, []);

  const submitOrder = useCallback(async (): Promise<SavedOrder> => {
    if (!selectedCustomer) throw new Error('Pilih customer terlebih dahulu.');
    if (selectedServices.length === 0) throw new Error('Pilih minimal satu layanan.');

    const payload: OrderPayload = {
      customerId: selectedCustomer.id,
      services: selectedServices.map((s) => ({
        name: s.name,
        price: s.price,
        quantity: serviceQtys[s.id],
        subtotal: s.price * serviceQtys[s.id],
      })),
      payment,
      itemCount: Number(itemCount),
      deliveryDate,
      isExpress,
      subtotal,
      expressFee: expressCharge,
      total: grandTotal,
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Gagal membuat order. Coba lagi.');

    const data = await res.json();
    const saved: SavedOrder = { ...payload, id: data.id };
    setCurrentOrder(saved);
    return saved;
  }, [
    selectedCustomer,
    selectedServices,
    serviceQtys,
    payment,
    itemCount,
    deliveryDate,
    isExpress,
    subtotal,
    expressCharge,
    grandTotal,
  ]);

  const value: OrderContextValue = {
    selectedCustomer,
    setSelectedCustomer,
    serviceQtys,
    updateQty,
    payment,
    setPayment,
    itemCount,
    setItemCount,
    deliveryDate,
    setDeliveryDate,
    isExpress,
    setIsExpress,
    subtotal,
    expressCharge,
    grandTotal,
    selectedServices,
    currentOrder,
    setCurrentOrder,
    openCustomerModal,
    setOpenCustomerModal,
    showReceipt,
    setShowReceipt,
    submitOrder,
    resetOrder,
    customers,
    customersLoading,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
}