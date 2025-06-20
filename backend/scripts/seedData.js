import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Contract from "../models/Contract.js";
import Invoice from "../models/Invoice.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "contractpro",
    });
    console.log("MongoDB Connected for seeding");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Client.deleteMany({});
    await Contract.deleteMany({});
    await Invoice.deleteMany({});
    console.log("✅ Existing data cleared");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = [
      {
        name: "Demo User",
        email: "demo@contractpro.com",
        password: "demo123",
        role: "freelancer",
        isEmailVerified: true,
        lastLoginAt: new Date(),
      },
      {
        name: "John Freelancer",
        email: "john@example.com",
        password: "password123",
        role: "freelancer",
        isEmailVerified: true,
      },
      {
        name: "Sarah Designer",
        email: "sarah@example.com",
        password: "password123",
        role: "freelancer",
        isEmailVerified: true,
      },
    ];

    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error("Error seeding users:", error);
    return [];
  }
};

// Seed clients
const seedClients = async (users) => {
  try {
    const clientsData = [
      // Clients for Demo User
      {
        name: "John Smith",
        email: "john.smith@acmecorp.com",
        company: "Acme Corporation",
        phone: "+1234567890",
        address: {
          street: "123 Business Ave",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "United States",
        },
        notes: "Main contact for web development projects",
        userId: users[0]._id,
      },
      {
        name: "Emily Johnson",
        email: "emily@techsolutions.com",
        company: "Tech Solutions Inc",
        phone: "+1987654321",
        address: {
          street: "456 Innovation Dr",
          city: "Austin",
          state: "TX",
          zipCode: "73301",
          country: "United States",
        },
        notes: "E-commerce development specialist",
        userId: users[0]._id,
      },
      {
        name: "Michael Brown",
        email: "mike@digitalmarketing.com",
        company: "Digital Marketing Pro",
        phone: "+1555123456",
        address: {
          street: "789 Marketing Blvd",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        notes: "Regular client for branding projects",
        userId: users[0]._id,
      },
      {
        name: "Lisa Wilson",
        email: "lisa@startupventure.com",
        company: "Startup Venture",
        phone: "+1444789012",
        address: {
          street: "321 Startup St",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "United States",
        },
        notes: "New startup, mobile app development",
        userId: users[0]._id,
      },
      {
        name: "David Martinez",
        email: "david@consultingfirm.com",
        company: "Elite Consulting",
        phone: "+1333567890",
        address: {
          street: "654 Professional Way",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "United States",
        },
        notes: "Corporate consulting projects",
        userId: users[0]._id,
      },
    ];

    const createdClients = await Client.create(clientsData);
    console.log(`✅ Created ${createdClients.length} clients`);
    return createdClients;
  } catch (error) {
    console.error("Error seeding clients:", error);
    return [];
  }
};

// Seed contracts
const seedContracts = async (users, clients) => {
  try {
    const contractsData = [
      {
        title: "Website Development Project",
        content:
          "Complete website development including frontend and backend development, responsive design, and SEO optimization. Project includes 5 pages, contact forms, and content management system.",
        clientId: clients[0]._id,
        userId: users[0]._id,
        amount: 5000,
        currency: "USD",
        status: "signed",
        sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        signedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        terms:
          "Payment terms: 50% upfront, 50% on completion. Project timeline: 6 weeks.",
      },
      {
        title: "E-commerce Platform Development",
        content:
          "Development of a comprehensive e-commerce platform with payment integration, inventory management, and admin dashboard. Includes mobile responsive design and security implementation.",
        clientId: clients[1]._id,
        userId: users[0]._id,
        amount: 8500,
        currency: "USD",
        status: "sent",
        sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        terms:
          "Payment terms: 30% upfront, 30% at milestone, 40% on completion.",
      },
      {
        title: "Brand Identity Design Package",
        content:
          "Complete brand identity design including logo design, business cards, letterhead, and brand guidelines. Includes 3 initial concepts and unlimited revisions.",
        clientId: clients[2]._id,
        userId: users[0]._id,
        amount: 2500,
        currency: "USD",
        status: "draft",
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        terms: "Payment terms: 50% upfront, 50% on final delivery.",
      },
      {
        title: "Mobile App Development",
        content:
          "Native mobile application development for iOS and Android platforms. Includes UI/UX design, backend API development, and app store submission.",
        clientId: clients[3]._id,
        userId: users[0]._id,
        amount: 12000,
        currency: "USD",
        status: "sent",
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        terms:
          "Payment terms: 25% upfront, 25% at design approval, 25% at development completion, 25% at launch.",
      },
    ];

    const createdContracts = await Contract.create(contractsData);
    console.log(`✅ Created ${createdContracts.length} contracts`);
    return createdContracts;
  } catch (error) {
    console.error("Error seeding contracts:", error);
    return [];
  }
};

// Seed invoices
const seedInvoices = async (users, clients) => {
  try {
    const invoicesData = [
      {
        invoiceNumber: "INV-0001",
        clientId: clients[0]._id,
        userId: users[0]._id,
        items: [
          {
            description: "Website Development - Frontend",
            quantity: 1,
            rate: 2500,
          },
          {
            description: "Website Development - Backend",
            quantity: 1,
            rate: 2000,
          },
          {
            description: "SEO Optimization",
            quantity: 1,
            rate: 500,
          },
        ],
        taxRate: 8.5,
        currency: "USD",
        status: "paid",
        issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        notes: "Thank you for your business!",
      },
      {
        invoiceNumber: "INV-0002",
        clientId: clients[1]._id,
        userId: users[0]._id,
        items: [
          {
            description: "E-commerce Development - Phase 1",
            quantity: 1,
            rate: 4000,
          },
          {
            description: "Payment Gateway Integration",
            quantity: 1,
            rate: 1500,
          },
        ],
        taxRate: 8.5,
        currency: "USD",
        status: "sent",
        issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        notes: "Phase 1 completion payment. Phase 2 invoice to follow.",
      },
      {
        invoiceNumber: "INV-0003",
        clientId: clients[2]._id,
        userId: users[0]._id,
        items: [
          {
            description: "Logo Design - Initial Concepts",
            quantity: 3,
            rate: 300,
          },
          {
            description: "Business Card Design",
            quantity: 1,
            rate: 200,
          },
        ],
        taxRate: 8.5,
        currency: "USD",
        status: "overdue",
        issueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (overdue)
        notes: "First payment for brand identity project.",
        reminders: [
          {
            type: "first",
            status: "sent",
            dateSent: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          },
        ],
      },
      {
        invoiceNumber: "INV-0004",
        clientId: clients[3]._id,
        userId: users[0]._id,
        items: [
          {
            description: "Mobile App - UI/UX Design",
            quantity: 1,
            rate: 3000,
          },
          {
            description: "Project Setup and Planning",
            quantity: 1,
            rate: 500,
          },
        ],
        taxRate: 8.5,
        currency: "USD",
        status: "paid",
        issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        notes: "First milestone payment for mobile app development.",
      },
      {
        invoiceNumber: "INV-0005",
        clientId: clients[4]._id,
        userId: users[0]._id,
        items: [
          {
            description: "Consulting Services - Q1 2024",
            quantity: 40,
            rate: 125,
          },
          {
            description: "Strategy Documentation",
            quantity: 1,
            rate: 800,
          },
        ],
        taxRate: 8.5,
        currency: "USD",
        status: "sent",
        issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        notes: "Monthly consulting retainer and strategy documentation.",
      },
    ];

    const createdInvoices = await Invoice.create(invoicesData);
    console.log(`✅ Created ${createdInvoices.length} invoices`);
    return createdInvoices;
  } catch (error) {
    console.error("Error seeding invoices:", error);
    return [];
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();
    await clearData();

    const users = await seedUsers();
    if (users.length === 0) {
      console.error("❌ Failed to create users. Aborting seed process.");
      return;
    }

    const clients = await seedClients(users);
    if (clients.length === 0) {
      console.error(
        "❌ Failed to create clients. Continuing with limited data...",
      );
    }

    const contracts = await seedContracts(users, clients);
    const invoices = await seedInvoices(users, clients);

    console.log(`
🎉 Database seeding completed successfully!

📊 Summary:
- Users: ${users.length}
- Clients: ${clients.length}
- Contracts: ${contracts.length}
- Invoices: ${invoices.length}

🔑 Demo Login Credentials:
- Email: demo@contractpro.com
- Password: demo123

🚀 You can now start the server and test the application!
    `);
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📡 Database connection closed");
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();
