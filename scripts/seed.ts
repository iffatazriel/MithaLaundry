import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminEmail = 'admin@mithalaundry.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await hashPassword('admin123')
    const admin = await prisma.user.create({
      data: {
        name: 'Admin Mitha Laundry',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'admin',
      },
    })
    console.log('✅ Admin user created:', admin.email)
  } else {
    console.log('⏭️  Admin user already exists')
  }

  // Create sample customers
  const customers = [
    {
      name: 'Budi Santoso',
      email: 'budi@example.com',
      phone: '6281234567890',
      status: 'regular',
    },
    {
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      phone: '6282345678901',
      status: 'vip',
    },
    {
      name: 'Ahmad Wijaya',
      email: 'ahmad@example.com',
      phone: '6283456789012',
      status: 'regular',
    },
    {
      name: 'Dewi Lestari',
      email: 'dewi@example.com',
      phone: '6284567890123',
      status: 'regular',
    },
    {
      name: 'Rudi Hermawan',
      email: 'rudi@example.com',
      phone: '6285678901234',
      status: 'vip',
    },
  ]

  const createdCustomers = []
  for (const customer of customers) {
    const existing = await prisma.customer.findUnique({
      where: { phone: customer.phone },
    })

    if (!existing) {
      const created = await prisma.customer.create({
        data: customer,
      })
      createdCustomers.push(created)
      console.log('✅ Customer created:', created.name)
    } else {
      createdCustomers.push(existing)
      console.log('⏭️  Customer already exists:', existing.name)
    }
  }

  // Create sample inventory items
  const inventoryItems = [
    {
      name: 'Deterjen Cair Premium',
      description: 'Deterjen cair berkualitas tinggi untuk laundry',
      category: 'detergent',
      quantity: 50,
      unit: 'liter',
      minStock: 10,
      maxStock: 100,
      price: 25000,
      supplier: 'PT Kimia Jaya',
    },
    {
      name: 'Pelembut Kain',
      description: 'Pelembut kain dengan aroma segar',
      category: 'fabric_softener',
      quantity: 30,
      unit: 'liter',
      minStock: 5,
      maxStock: 50,
      price: 15000,
      supplier: 'PT Kimia Jaya',
    },
    {
      name: 'Pemutih Pakaian',
      description: 'Pemutih pakaian aman untuk semua jenis kain',
      category: 'detergent',
      quantity: 20,
      unit: 'liter',
      minStock: 5,
      maxStock: 40,
      price: 20000,
      supplier: 'PT Kimia Jaya',
    },
    {
      name: 'Mesin Cuci Industrial',
      description: 'Mesin cuci kapasitas 50kg',
      category: 'equipment',
      quantity: 2,
      unit: 'pcs',
      minStock: 1,
      maxStock: 3,
      price: 50000000,
      supplier: 'PT Mesin Laundry',
    },
    {
      name: 'Setrika Uap',
      description: 'Setrika uap profesional',
      category: 'equipment',
      quantity: 5,
      unit: 'pcs',
      minStock: 2,
      maxStock: 10,
      price: 2000000,
      supplier: 'PT Mesin Laundry',
    },
    {
      name: 'Tas Laundry Mesh',
      description: 'Tas mesh untuk laundry',
      category: 'other',
      quantity: 100,
      unit: 'pcs',
      minStock: 20,
      maxStock: 200,
      price: 50000,
      supplier: 'CV Plastik Jaya',
    },
  ]

  for (const item of inventoryItems) {
    const existing = await prisma.inventoryItem.findUnique({
      where: { name: item.name },
    })

    if (!existing) {
      const created = await prisma.inventoryItem.create({
        data: item,
      })
      console.log('✅ Inventory item created:', created.name)
    } else {
      console.log('⏭️  Inventory item already exists:', existing.name)
    }
  }

  // Create sample orders
  if (createdCustomers.length > 0) {
    const sampleOrders = [
      {
        customerId: createdCustomers[0].id,
        status: 'completed',
        services: [
          {
            name: 'Cuci dan Setrika',
            price: 5000,
            quantity: 10,
            subtotal: 50000,
          },
        ],
        payment: 'cash',
        paymentStatus: 'paid',
        paymentProvider: 'cash',
        subtotal: 50000,
        expressFee: 0,
        total: 50000,
        itemCount: 10,
        isExpress: false,
        paidAt: new Date(),
      },
      {
        customerId: createdCustomers[1].id,
        status: 'ready',
        services: [
          {
            name: 'Dry Cleaning',
            price: 15000,
            quantity: 3,
            subtotal: 45000,
          },
        ],
        payment: 'qris',
        paymentStatus: 'paid',
        paymentProvider: 'midtrans',
        subtotal: 45000,
        expressFee: 5000,
        total: 50000,
        itemCount: 3,
        isExpress: true,
        paidAt: new Date(),
      },
    ]

    for (const order of sampleOrders) {
      const primaryService = order.services[0]
      const created = await prisma.order.create({
        data: {
          ...order,
          service: order.services.map((service) => service.name).join(', '),
          price: primaryService?.price ?? 0,
          totalItems: order.itemCount,
          totalPrice: order.total,
          statusHistory: {
            create: {
              toStatus: order.status,
              note: 'Order dibuat dari seeding',
              changedBy: 'admin@mithalaundry.com',
            },
          },
        },
      })
      console.log('✅ Order created:', created.id)
    }
  }

  console.log('✨ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
