import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model';
import Property from './models/Property.model';
import Tenant from './models/Tenant.model';
import Maintenance from './models/Maintenance.model';
import Payment from './models/Payment.model';
import Document from './models/Document.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pms_database';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { autoIndex: false });
    console.log('Connected to MongoDB');

    // Clear all collections and drop indexes (the 2dsphere index
    // on Property.address.coordinates is incompatible with the {lat,lng} schema)
    await Promise.all([
      User.deleteMany({}),
      Property.collection.drop().catch(() => {}),
      Tenant.deleteMany({}),
      Maintenance.deleteMany({}),
      Payment.deleteMany({}),
      Document.deleteMany({}),
    ]);
    console.log('Cleared all collections');

    // ============ USERS ============
    const users = await User.create([
      {
        email: 'admin@pms.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Admin',
        role: 'admin',
        phoneNumber: '555-100-0001',
        address: {
          street: '100 Admin Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        isActive: true,
      },
      {
        email: 'manager@pms.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Manager',
        role: 'manager',
        phoneNumber: '555-200-0002',
        address: {
          street: '200 Manager St',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'USA',
        },
        isActive: true,
      },
      {
        email: 'owner@pms.com',
        password: 'password123',
        firstName: 'Michael',
        lastName: 'Owner',
        role: 'owner',
        phoneNumber: '555-300-0003',
        address: {
          street: '300 Owner Ave',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA',
        },
        isActive: true,
      },
      {
        email: 'tenant1@pms.com',
        password: 'password123',
        firstName: 'Emily',
        lastName: 'Johnson',
        role: 'tenant',
        phoneNumber: '555-400-0004',
        address: {
          street: '400 Tenant Ln',
          city: 'New York',
          state: 'NY',
          zipCode: '10003',
          country: 'USA',
        },
        isActive: true,
      },
      {
        email: 'tenant2@pms.com',
        password: 'password123',
        firstName: 'David',
        lastName: 'Williams',
        role: 'tenant',
        phoneNumber: '555-500-0005',
        address: {
          street: '500 Renter Rd',
          city: 'Austin',
          state: 'TX',
          zipCode: '73302',
          country: 'USA',
        },
        isActive: true,
      },
      {
        email: 'maintenance@pms.com',
        password: 'password123',
        firstName: 'Robert',
        lastName: 'Fix',
        role: 'maintenance',
        phoneNumber: '555-600-0006',
        address: {
          street: '600 Repair Ct',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        isActive: true,
      },
    ]);

    const [admin, manager, owner, tenant1User, tenant2User, maintenanceUser] = users;
    console.log(`Created ${users.length} users`);

    // ============ PROPERTIES ============
    const properties = await Property.create([
      {
        propertyId: 'PROP-001',
        name: 'Sunset Apartments',
        type: 'apartment',
        address: {
          street: '123 Sunset Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        owner: owner._id,
        manager: manager._id,
        description: 'Modern luxury apartment complex in the heart of Manhattan with stunning city views and premium amenities.',
        features: ['Central AC', 'In-unit Washer/Dryer', 'Hardwood Floors', 'Walk-in Closet', 'Balcony'],
        amenities: ['Gym', 'Rooftop Pool', 'Doorman', 'Package Room', 'Bike Storage'],
        images: [],
        status: 'occupied',
        details: {
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1200,
          yearBuilt: 2018,
          lotSize: 0,
          parkingSpaces: 1,
          furnished: false,
          petsAllowed: true,
          smokingAllowed: false,
        },
        financials: {
          purchasePrice: 650000,
          currentValue: 720000,
          monthlyRent: 3200,
          securityDeposit: 6400,
          applicationFee: 50,
          petDeposit: 500,
          utilities: {
            water: true,
            electricity: false,
            gas: false,
            internet: false,
            trash: true,
            sewer: true,
          },
          propertyTax: 8500,
          insurance: 2400,
          hoa: 450,
          managementFee: 320,
        },
        maintenance: {
          lastInspection: new Date('2025-09-15'),
          nextInspection: new Date('2026-03-15'),
          schedule: {
            hvac: new Date('2026-04-01'),
            plumbing: new Date('2026-06-01'),
          },
          history: [],
        },
        documents: [],
        tags: ['luxury', 'manhattan', 'pet-friendly'],
        metrics: {
          occupancyRate: 95,
          totalRevenue: 38400,
          totalExpenses: 11670,
          netIncome: 26730,
        },
      },
      {
        propertyId: 'PROP-002',
        name: 'Oak Street House',
        type: 'single-family',
        address: {
          street: '456 Oak Street',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA',
          coordinates: { lat: 30.2672, lng: -97.7431 },
        },
        owner: owner._id,
        manager: manager._id,
        description: 'Charming single-family home in a quiet Austin neighborhood with a large backyard and updated kitchen.',
        features: ['Updated Kitchen', 'Large Backyard', 'Two-car Garage', 'Fireplace', 'Covered Patio'],
        amenities: ['Fenced Yard', 'Sprinkler System', 'Storage Shed'],
        images: [],
        status: 'occupied',
        details: {
          bedrooms: 3,
          bathrooms: 2,
          squareFeet: 1800,
          yearBuilt: 2005,
          lotSize: 7500,
          parkingSpaces: 2,
          furnished: false,
          petsAllowed: true,
          smokingAllowed: false,
        },
        financials: {
          purchasePrice: 380000,
          currentValue: 450000,
          monthlyRent: 2200,
          securityDeposit: 4400,
          applicationFee: 35,
          petDeposit: 300,
          utilities: {
            water: false,
            electricity: false,
            gas: false,
            internet: false,
            trash: false,
            sewer: false,
          },
          propertyTax: 5200,
          insurance: 1800,
          managementFee: 220,
        },
        maintenance: {
          lastInspection: new Date('2025-08-01'),
          nextInspection: new Date('2026-02-01'),
          schedule: {
            hvac: new Date('2026-03-15'),
            roof: new Date('2026-07-01'),
            exterior: new Date('2026-05-01'),
          },
          history: [],
        },
        documents: [],
        tags: ['family-home', 'austin', 'pet-friendly'],
        metrics: {
          occupancyRate: 100,
          totalRevenue: 26400,
          totalExpenses: 7220,
          netIncome: 19180,
        },
      },
      {
        propertyId: 'PROP-003',
        name: 'Downtown Condo',
        type: 'condo',
        address: {
          street: '789 Michigan Ave',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
          coordinates: { lat: 41.8781, lng: -87.6298 },
        },
        owner: owner._id,
        description: 'Sleek downtown condo with floor-to-ceiling windows and lake views. Walking distance to shops and dining.',
        features: ['Floor-to-Ceiling Windows', 'Lake View', 'Quartz Countertops', 'Smart Home System'],
        amenities: ['Concierge', 'Fitness Center', 'Business Center', 'Party Room'],
        images: [],
        status: 'available',
        details: {
          bedrooms: 1,
          bathrooms: 1,
          squareFeet: 850,
          yearBuilt: 2020,
          parkingSpaces: 1,
          furnished: true,
          petsAllowed: false,
          smokingAllowed: false,
        },
        financials: {
          purchasePrice: 420000,
          currentValue: 460000,
          monthlyRent: 2800,
          securityDeposit: 5600,
          applicationFee: 75,
          utilities: {
            water: true,
            electricity: false,
            gas: true,
            internet: false,
            trash: true,
            sewer: true,
          },
          propertyTax: 6800,
          insurance: 2000,
          hoa: 600,
          managementFee: 280,
        },
        maintenance: {
          lastInspection: new Date('2025-11-01'),
          nextInspection: new Date('2026-05-01'),
          schedule: {},
          history: [],
        },
        documents: [],
        tags: ['downtown', 'chicago', 'lake-view', 'furnished'],
        metrics: {
          occupancyRate: 0,
          totalRevenue: 0,
          totalExpenses: 9680,
          netIncome: -9680,
        },
      },
      {
        propertyId: 'PROP-004',
        name: 'Pine Valley Townhouse',
        type: 'townhouse',
        address: {
          street: '321 Pine Valley Dr',
          city: 'Denver',
          state: 'CO',
          zipCode: '80201',
          country: 'USA',
          coordinates: { lat: 39.7392, lng: -104.9903 },
        },
        owner: owner._id,
        manager: manager._id,
        description: 'Spacious townhouse in a gated community with mountain views. Currently undergoing kitchen renovation.',
        features: ['Mountain View', 'Granite Countertops', 'Vaulted Ceilings', 'Attached Garage'],
        amenities: ['Gated Community', 'Community Pool', 'Walking Trails', 'Playground'],
        images: [],
        status: 'maintenance',
        details: {
          bedrooms: 3,
          bathrooms: 2.5,
          squareFeet: 2100,
          yearBuilt: 2012,
          lotSize: 3500,
          parkingSpaces: 2,
          furnished: false,
          petsAllowed: true,
          smokingAllowed: false,
        },
        financials: {
          purchasePrice: 340000,
          currentValue: 410000,
          monthlyRent: 2500,
          securityDeposit: 5000,
          applicationFee: 40,
          petDeposit: 400,
          utilities: {
            water: true,
            electricity: false,
            gas: false,
            internet: false,
            trash: true,
            sewer: true,
          },
          propertyTax: 4800,
          insurance: 1600,
          hoa: 350,
          managementFee: 250,
        },
        maintenance: {
          lastInspection: new Date('2025-10-20'),
          nextInspection: new Date('2026-04-20'),
          schedule: {
            hvac: new Date('2026-05-01'),
            plumbing: new Date('2026-08-01'),
          },
          history: [],
        },
        documents: [],
        tags: ['townhouse', 'denver', 'mountain-view', 'gated'],
        metrics: {
          occupancyRate: 0,
          totalRevenue: 0,
          totalExpenses: 7000,
          netIncome: -7000,
        },
      },
    ]);

    const [propSunset, propOak, propCondo, propPine] = properties;

    // Link properties to owner
    await User.findByIdAndUpdate(owner._id, {
      properties: properties.map((p) => p._id),
    });

    console.log(`Created ${properties.length} properties`);

    // ============ TENANTS ============
    const tenants = await Tenant.create([
      {
        user: tenant1User._id,
        property: propSunset._id,
        leaseStart: new Date('2025-06-01'),
        leaseEnd: new Date('2026-05-31'),
        monthlyRent: 3200,
        securityDeposit: 6400,
        depositPaid: true,
        emergencyContact: {
          name: 'Laura Johnson',
          relationship: 'Mother',
          phone: '555-700-0007',
          email: 'laura.johnson@email.com',
        },
        employment: {
          employer: 'TechCorp Inc.',
          position: 'Software Engineer',
          salary: 120000,
          startDate: new Date('2023-03-15'),
          supervisorName: 'Mark Stevens',
          supervisorPhone: '555-800-0008',
        },
        references: [
          {
            name: 'James Anderson',
            relationship: 'Former Landlord',
            phone: '555-900-0009',
            email: 'james.a@email.com',
          },
        ],
        vehicles: [
          {
            make: 'Toyota',
            model: 'Camry',
            year: 2022,
            color: 'Silver',
            licensePlate: 'NY-ABC1234',
          },
        ],
        // NOTE: pets, paymentHistory, and documents arrays can't hold subdocuments
        // because the Tenant schema uses `type: String` inside them, which Mongoose
        // interprets as the SchemaType declaration (making them [String] arrays).
        pets: [],
        background: {
          creditScore: 740,
          criminalRecord: false,
          evictionHistory: false,
          bankruptcyHistory: false,
          verificationDate: new Date('2025-05-15'),
        },
        paymentHistory: [],
        documents: [],
        notes: 'Excellent tenant. Always pays on time.',
        status: 'active',
        moveInDate: new Date('2025-06-01'),
        balance: 0,
        autoPayEnabled: true,
        preferredContactMethod: 'email',
      },
      {
        user: tenant2User._id,
        property: propOak._id,
        leaseStart: new Date('2025-03-01'),
        leaseEnd: new Date('2026-02-28'),
        monthlyRent: 2200,
        securityDeposit: 4400,
        depositPaid: true,
        emergencyContact: {
          name: 'Patricia Williams',
          relationship: 'Sister',
          phone: '555-710-0010',
          email: 'patricia.w@email.com',
        },
        employment: {
          employer: 'Austin Energy',
          position: 'Project Manager',
          salary: 95000,
          startDate: new Date('2021-08-01'),
        },
        references: [
          {
            name: 'Susan Clark',
            relationship: 'Former Landlord',
            phone: '555-720-0011',
          },
        ],
        vehicles: [
          {
            make: 'Ford',
            model: 'F-150',
            year: 2021,
            color: 'Blue',
            licensePlate: 'TX-XYZ5678',
          },
        ],
        pets: [],
        background: {
          creditScore: 680,
          criminalRecord: false,
          evictionHistory: false,
          bankruptcyHistory: false,
          verificationDate: new Date('2025-02-10'),
        },
        paymentHistory: [],
        documents: [],
        notes: 'Occasional late payment. Otherwise a good tenant.',
        status: 'active',
        moveInDate: new Date('2025-03-01'),
        balance: 0,
        autoPayEnabled: false,
        preferredContactMethod: 'phone',
      },
      {
        user: tenant1User._id,
        property: propPine._id,
        leaseStart: new Date('2026-05-01'),
        leaseEnd: new Date('2027-04-30'),
        monthlyRent: 2500,
        securityDeposit: 5000,
        depositPaid: false,
        emergencyContact: {
          name: 'Laura Johnson',
          relationship: 'Mother',
          phone: '555-700-0007',
        },
        employment: {
          employer: 'TechCorp Inc.',
          position: 'Software Engineer',
          salary: 120000,
          startDate: new Date('2023-03-15'),
        },
        references: [],
        vehicles: [],
        pets: [],
        background: {
          creditScore: 740,
          criminalRecord: false,
          evictionHistory: false,
          bankruptcyHistory: false,
        },
        paymentHistory: [],
        documents: [],
        notes: 'Pending approval for Pine Valley Townhouse. Waiting for renovation to complete.',
        status: 'pending',
        balance: 0,
        autoPayEnabled: false,
        preferredContactMethod: 'email',
      },
    ]);

    const [tenantEmily, tenantDavid, tenantEmilyPending] = tenants;

    // Link lease info to occupied properties
    await Property.findByIdAndUpdate(propSunset._id, {
      lease: {
        tenant: tenantEmily._id,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2026-05-31'),
        rentAmount: 3200,
        paymentDay: 1,
        terms: '12-month lease with option to renew',
        documents: [],
      },
    });

    await Property.findByIdAndUpdate(propOak._id, {
      lease: {
        tenant: tenantDavid._id,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2026-02-28'),
        rentAmount: 2200,
        paymentDay: 1,
        terms: '12-month lease',
        documents: [],
      },
    });

    console.log(`Created ${tenants.length} tenants`);

    // ============ MAINTENANCE REQUESTS ============
    const maintenanceRequests = await Maintenance.create([
      {
        ticketId: 'MNT-001',
        property: propSunset._id,
        tenant: tenantEmily._id,
        reportedBy: tenant1User._id,
        category: 'plumbing',
        priority: 'medium',
        status: 'pending',
        title: 'Leaky kitchen faucet',
        description: 'The kitchen faucet has been dripping constantly for the past two days. Water is pooling around the base of the faucet.',
        location: 'Kitchen',
        images: [],
        estimatedCost: 150,
        notes: [
          {
            author: tenant1User._id,
            content: 'Started dripping on Monday. Getting worse each day.',
            timestamp: new Date('2026-01-20'),
          },
        ],
        timeline: [
          {
            status: 'pending',
            timestamp: new Date('2026-01-20'),
            user: tenant1User._id,
            comment: 'Ticket created',
          },
        ],
        materials: [],
      },
      {
        ticketId: 'MNT-002',
        property: propOak._id,
        tenant: tenantDavid._id,
        reportedBy: tenant2User._id,
        assignedTo: maintenanceUser._id,
        category: 'hvac',
        priority: 'high',
        status: 'in-progress',
        title: 'AC not cooling properly',
        description: 'The central AC unit is running but not cooling the house below 80°F. Filter was recently changed.',
        location: 'Whole house - HVAC system',
        images: [],
        scheduledDate: new Date('2026-02-03'),
        estimatedCost: 500,
        vendor: {
          name: 'Tom Rodriguez',
          company: 'CoolAir HVAC Services',
          phone: '555-888-9999',
          email: 'tom@coolairhvac.com',
        },
        notes: [
          {
            author: tenant2User._id,
            content: 'House stays at 80°F even with AC running all day.',
            timestamp: new Date('2026-01-18'),
          },
          {
            author: maintenanceUser._id,
            content: 'Checked refrigerant levels, they are low. Scheduling recharge.',
            timestamp: new Date('2026-01-25'),
          },
        ],
        timeline: [
          {
            status: 'pending',
            timestamp: new Date('2026-01-18'),
            user: tenant2User._id,
            comment: 'Ticket created',
          },
          {
            status: 'in-progress',
            timestamp: new Date('2026-01-25'),
            user: maintenanceUser._id,
            comment: 'Assigned to CoolAir HVAC. Inspection complete, scheduling repair.',
          },
        ],
        materials: [
          { item: 'R-410A Refrigerant', quantity: 2, cost: 85 },
        ],
        laborHours: 2,
      },
      {
        ticketId: 'MNT-003',
        property: propSunset._id,
        tenant: tenantEmily._id,
        reportedBy: tenant1User._id,
        assignedTo: maintenanceUser._id,
        category: 'structural',
        priority: 'low',
        status: 'completed',
        title: 'Broken window lock',
        description: 'The lock on the bedroom window is broken and won\'t latch properly.',
        location: 'Master Bedroom - Window',
        images: [],
        scheduledDate: new Date('2026-01-10'),
        completedDate: new Date('2026-01-12'),
        estimatedCost: 75,
        actualCost: 60,
        notes: [
          {
            author: maintenanceUser._id,
            content: 'Replaced the window lock mechanism. Window now latches securely.',
            timestamp: new Date('2026-01-12'),
          },
        ],
        timeline: [
          {
            status: 'pending',
            timestamp: new Date('2026-01-05'),
            user: tenant1User._id,
            comment: 'Ticket created',
          },
          {
            status: 'in-progress',
            timestamp: new Date('2026-01-10'),
            user: maintenanceUser._id,
            comment: 'On-site, assessing the lock.',
          },
          {
            status: 'completed',
            timestamp: new Date('2026-01-12'),
            user: maintenanceUser._id,
            comment: 'Lock replaced and tested.',
          },
        ],
        materials: [
          { item: 'Window Lock Assembly', quantity: 1, cost: 25 },
        ],
        laborHours: 1.5,
        satisfaction: {
          rating: 5,
          feedback: 'Fixed quickly and cleanly. Thank you!',
          date: new Date('2026-01-13'),
        },
      },
      {
        ticketId: 'MNT-004',
        property: propPine._id,
        reportedBy: manager._id,
        category: 'electrical',
        priority: 'emergency',
        status: 'pending',
        title: 'Electrical outlet sparking',
        description: 'Outlet in the living room is sparking when appliances are plugged in. Potential fire hazard. Noticed during renovation inspection.',
        location: 'Living Room - South Wall Outlet',
        images: [],
        estimatedCost: 300,
        notes: [
          {
            author: manager._id,
            content: 'Discovered during renovation walkthrough. Breaker for this circuit has been turned off as a safety precaution.',
            timestamp: new Date('2026-01-28'),
          },
        ],
        timeline: [
          {
            status: 'pending',
            timestamp: new Date('2026-01-28'),
            user: manager._id,
            comment: 'Emergency ticket created. Circuit breaker turned off.',
          },
        ],
        materials: [],
      },
    ]);

    // Link maintenance to property history
    await Property.findByIdAndUpdate(propSunset._id, {
      $push: {
        'maintenance.history': {
          $each: [maintenanceRequests[0]._id, maintenanceRequests[2]._id],
        },
      },
    });

    await Property.findByIdAndUpdate(propOak._id, {
      $push: { 'maintenance.history': maintenanceRequests[1]._id },
    });

    await Property.findByIdAndUpdate(propPine._id, {
      $push: { 'maintenance.history': maintenanceRequests[3]._id },
    });

    // Link maintenance to tenants
    await Tenant.findByIdAndUpdate(tenantEmily._id, {
      $push: {
        maintenanceRequests: {
          $each: [maintenanceRequests[0]._id, maintenanceRequests[2]._id],
        },
      },
    });

    await Tenant.findByIdAndUpdate(tenantDavid._id, {
      $push: { maintenanceRequests: maintenanceRequests[1]._id },
    });

    console.log(`Created ${maintenanceRequests.length} maintenance requests`);

    // ============ PAYMENTS ============
    const payments = await Payment.create([
      {
        paymentId: 'PAY-001',
        property: propSunset._id,
        tenant: tenantEmily._id,
        type: 'deposit',
        amount: 6400,
        dueDate: new Date('2025-05-25'),
        paidDate: new Date('2025-05-22'),
        status: 'paid',
        method: 'ach',
        transactionId: 'TXN-DEP-001',
        description: 'Security deposit for Sunset Apartments',
        createdBy: admin._id,
        reminders: [],
      },
      {
        paymentId: 'PAY-002',
        property: propSunset._id,
        tenant: tenantEmily._id,
        type: 'rent',
        amount: 3200,
        dueDate: new Date('2026-01-01'),
        paidDate: new Date('2025-12-30'),
        status: 'paid',
        method: 'ach',
        transactionId: 'TXN-RENT-JAN-001',
        description: 'January 2026 rent - Sunset Apartments',
        recurring: {
          enabled: true,
          frequency: 'monthly',
          nextDate: new Date('2026-02-01'),
          endDate: new Date('2026-05-31'),
        },
        createdBy: admin._id,
        reminders: [],
      },
      {
        paymentId: 'PAY-003',
        property: propSunset._id,
        tenant: tenantEmily._id,
        type: 'rent',
        amount: 3200,
        dueDate: new Date('2026-02-01'),
        status: 'pending',
        description: 'February 2026 rent - Sunset Apartments',
        recurring: {
          enabled: true,
          frequency: 'monthly',
          nextDate: new Date('2026-03-01'),
          endDate: new Date('2026-05-31'),
        },
        createdBy: admin._id,
        reminders: [
          {
            sentDate: new Date('2026-01-25'),
            method: 'email',
            status: 'sent',
          },
        ],
      },
      {
        paymentId: 'PAY-004',
        property: propOak._id,
        tenant: tenantDavid._id,
        type: 'rent',
        amount: 2200,
        dueDate: new Date('2026-01-01'),
        paidDate: new Date('2026-01-08'),
        status: 'paid',
        method: 'online',
        transactionId: 'TXN-RENT-JAN-002',
        lateFee: 50,
        description: 'January 2026 rent - Oak Street House (paid late)',
        createdBy: admin._id,
        reminders: [
          {
            sentDate: new Date('2025-12-28'),
            method: 'email',
            status: 'sent',
          },
          {
            sentDate: new Date('2026-01-03'),
            method: 'sms',
            status: 'sent',
          },
        ],
      },
      {
        paymentId: 'PAY-005',
        property: propOak._id,
        tenant: tenantDavid._id,
        type: 'late-fee',
        amount: 50,
        dueDate: new Date('2026-01-06'),
        paidDate: new Date('2026-01-08'),
        status: 'paid',
        method: 'online',
        transactionId: 'TXN-LATE-001',
        description: 'Late fee for January 2026 rent - Oak Street House',
        createdBy: admin._id,
        reminders: [],
      },
      {
        paymentId: 'PAY-006',
        property: propOak._id,
        tenant: tenantDavid._id,
        type: 'rent',
        amount: 2200,
        dueDate: new Date('2026-02-01'),
        status: 'pending',
        description: 'February 2026 rent - Oak Street House',
        createdBy: admin._id,
        reminders: [
          {
            sentDate: new Date('2026-01-25'),
            method: 'email',
            status: 'sent',
          },
        ],
      },
    ]);

    console.log(`Created ${payments.length} payments`);

    // ============ DOCUMENTS ============
    const documents = await Document.create([
      {
        documentId: 'DOC-001',
        name: 'Lease Agreement - Sunset Apartments',
        type: 'lease',
        category: 'legal',
        property: propSunset._id,
        tenant: tenantEmily._id,
        uploadedBy: admin._id,
        fileUrl: '/uploads/documents/lease-sunset-001.pdf',
        fileSize: 245000,
        mimeType: 'application/pdf',
        description: 'Standard 12-month residential lease agreement for Sunset Apartments Unit 4B.',
        tags: ['lease', 'sunset-apartments', '2025-2026'],
        version: 1,
        previousVersions: [],
        isConfidential: false,
        accessControl: [
          { user: tenant1User._id, permission: 'view', accessCount: 3 },
          { user: manager._id, permission: 'edit', accessCount: 5 },
          { user: admin._id, permission: 'delete', accessCount: 2 },
        ],
        signatures: [
          {
            user: tenant1User._id,
            signedDate: new Date('2025-05-20'),
            ipAddress: '192.168.1.100',
            signature: 'emily-johnson-sig-hash-001',
          },
          {
            user: owner._id,
            signedDate: new Date('2025-05-21'),
            ipAddress: '192.168.1.200',
            signature: 'michael-owner-sig-hash-001',
          },
        ],
        audit: [
          {
            action: 'uploaded',
            user: admin._id,
            timestamp: new Date('2025-05-18'),
            details: 'Initial lease document uploaded',
          },
          {
            action: 'viewed',
            user: tenant1User._id,
            timestamp: new Date('2025-05-19'),
          },
          {
            action: 'edited',
            user: manager._id,
            timestamp: new Date('2025-05-20'),
            details: 'Updated pet policy addendum',
          },
        ],
        isArchived: false,
      },
      {
        documentId: 'DOC-002',
        name: 'Property Insurance Certificate',
        type: 'insurance',
        category: 'financial',
        property: propOak._id,
        uploadedBy: owner._id,
        fileUrl: '/uploads/documents/insurance-oak-001.pdf',
        fileSize: 180000,
        mimeType: 'application/pdf',
        description: 'Annual property insurance certificate for Oak Street House.',
        tags: ['insurance', 'oak-street', '2025-2026'],
        version: 1,
        previousVersions: [],
        expiryDate: new Date('2026-12-31'),
        reminderDate: new Date('2026-11-01'),
        isConfidential: true,
        accessControl: [
          { user: owner._id, permission: 'edit', accessCount: 4 },
          { user: admin._id, permission: 'delete', accessCount: 1 },
        ],
        signatures: [],
        audit: [
          {
            action: 'uploaded',
            user: owner._id,
            timestamp: new Date('2025-12-15'),
            details: 'Insurance certificate uploaded for annual renewal',
          },
        ],
        isArchived: false,
      },
      {
        documentId: 'DOC-003',
        name: 'Move-In Inspection Report',
        type: 'inspection',
        category: 'maintenance',
        property: propSunset._id,
        tenant: tenantEmily._id,
        uploadedBy: manager._id,
        fileUrl: '/uploads/documents/inspection-sunset-001.pdf',
        fileSize: 520000,
        mimeType: 'application/pdf',
        description: 'Detailed move-in condition inspection report for Sunset Apartments Unit 4B.',
        tags: ['inspection', 'move-in', 'sunset-apartments'],
        version: 1,
        previousVersions: [],
        isConfidential: false,
        accessControl: [
          { user: tenant1User._id, permission: 'view', accessCount: 1 },
          { user: manager._id, permission: 'edit', accessCount: 2 },
        ],
        signatures: [
          {
            user: tenant1User._id,
            signedDate: new Date('2025-06-01'),
            ipAddress: '192.168.1.100',
            signature: 'emily-johnson-sig-hash-002',
          },
          {
            user: manager._id,
            signedDate: new Date('2025-06-01'),
            ipAddress: '192.168.1.150',
            signature: 'sarah-manager-sig-hash-001',
          },
        ],
        audit: [
          {
            action: 'uploaded',
            user: manager._id,
            timestamp: new Date('2025-06-01'),
            details: 'Move-in inspection completed and uploaded',
          },
          {
            action: 'viewed',
            user: tenant1User._id,
            timestamp: new Date('2025-06-02'),
          },
        ],
        isArchived: false,
      },
    ]);

    // Link documents to properties
    await Property.findByIdAndUpdate(propSunset._id, {
      $push: {
        documents: { $each: [documents[0]._id, documents[2]._id] },
      },
    });

    await Property.findByIdAndUpdate(propOak._id, {
      $push: { documents: documents[1]._id },
    });

    console.log(`Created ${documents.length} documents`);

    // ============ SUMMARY ============
    console.log('\n========================================');
    console.log('  Database seeded successfully!');
    console.log('========================================');
    console.log(`  Users:        ${users.length}`);
    console.log(`  Properties:   ${properties.length}`);
    console.log(`  Tenants:      ${tenants.length}`);
    console.log(`  Maintenance:  ${maintenanceRequests.length}`);
    console.log(`  Payments:     ${payments.length}`);
    console.log(`  Documents:    ${documents.length}`);
    console.log('========================================');
    console.log('\nLogin credentials:');
    console.log('  Admin:       admin@pms.com / password123');
    console.log('  Manager:     manager@pms.com / password123');
    console.log('  Owner:       owner@pms.com / password123');
    console.log('  Tenant 1:    tenant1@pms.com / password123');
    console.log('  Tenant 2:    tenant2@pms.com / password123');
    console.log('  Maintenance: maintenance@pms.com / password123');
    console.log('========================================\n');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
