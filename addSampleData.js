import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGO_URI is not set in .env file');
  process.exit(1);
}

// Sample users data
const sampleUsers = [
  {
    fullName: 'Alex Dev',
    email: 'alex@example.com',
    password: await bcryptjs.hash('password123', 10),
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    fullName: 'Sarah Design',
    email: 'sarah@example.com',
    password: await bcryptjs.hash('password123', 10),
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    fullName: 'Mike Tech',
    email: 'mike@example.com',
    password: await bcryptjs.hash('password123', 10),
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  },
  {
    fullName: 'Emma Creative',
    email: 'emma@example.com',
    password: await bcryptjs.hash('password123', 10),
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  },
  {
    fullName: 'John Startup',
    email: 'john@example.com',
    password: await bcryptjs.hash('password123', 10),
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
];

// Sample genuine messages
const createSampleMessages = (userIds) => {
  return [
    // Chat 1: Alex & Sarah
    {
      senderId: userIds[0],
      receiverId: userIds[1],
      text: 'Hey Sarah! How are you doing?',
      timestamp: new Date('2026-03-25T10:30:00'),
    },
    {
      senderId: userIds[1],
      receiverId: userIds[0],
      text: 'Hi Alex! I\'m good, just finished the design mockups for the project',
      timestamp: new Date('2026-03-25T10:45:00'),
    },
    {
      senderId: userIds[0],
      receiverId: userIds[1],
      text: 'That\'s awesome! Can you share them with me? I\'d love to see what you came up with',
      timestamp: new Date('2026-03-25T11:00:00'),
    },
    {
      senderId: userIds[1],
      receiverId: userIds[0],
      text: 'Sure! I\'ll send them over in the next hour. I made 3 different variations',
      timestamp: new Date('2026-03-25T11:15:00'),
    },

    // Chat 2: Alex & Mike
    {
      senderId: userIds[0],
      receiverId: userIds[2],
      text: 'Mike, did you check the API documentation I shared?',
      timestamp: new Date('2026-03-24T14:20:00'),
    },
    {
      senderId: userIds[2],
      receiverId: userIds[0],
      text: 'Yes! The REST endpoints look good. I\'m implementing the WebSocket integration now',
      timestamp: new Date('2026-03-24T14:35:00'),
    },
    {
      senderId: userIds[0],
      receiverId: userIds[2],
      text: 'Perfect! That\'s exactly what we need for real-time updates',
      timestamp: new Date('2026-03-24T14:50:00'),
    },
    {
      senderId: userIds[2],
      receiverId: userIds[0],
      text: 'Should have it ready for testing by tomorrow',
      timestamp: new Date('2026-03-24T15:05:00'),
    },

    // Chat 3: Sarah & Emma
    {
      senderId: userIds[1],
      receiverId: userIds[3],
      text: 'Emma! Want to grab coffee this weekend?',
      timestamp: new Date('2026-03-23T16:10:00'),
    },
    {
      senderId: userIds[3],
      receiverId: userIds[1],
      text: 'Yes! Saturday morning? There\'s that new cafe downtown I want to try',
      timestamp: new Date('2026-03-23T16:25:00'),
    },
    {
      senderId: userIds[1],
      receiverId: userIds[3],
      text: 'Sounds perfect! 10 AM?',
      timestamp: new Date('2026-03-23T16:40:00'),
    },
    {
      senderId: userIds[3],
      receiverId: userIds[1],
      text: 'See you then! 😊',
      timestamp: new Date('2026-03-23T16:55:00'),
    },

    // Chat 4: Mike & John
    {
      senderId: userIds[2],
      receiverId: userIds[4],
      text: 'John, I reviewed your startup pitch deck. It\'s really solid!',
      timestamp: new Date('2026-03-22T09:15:00'),
    },
    {
      senderId: userIds[4],
      receiverId: userIds[2],
      text: 'Thanks Mike! Your feedback really helped. Want to be our CTO? 😄',
      timestamp: new Date('2026-03-22T09:30:00'),
    },
    {
      senderId: userIds[2],
      receiverId: userIds[4],
      text: 'Haha, I appreciate that! Let\'s talk more about the product roadmap',
      timestamp: new Date('2026-03-22T09:45:00'),
    },
    {
      senderId: userIds[4],
      receiverId: userIds[2],
      text: 'Definitely! I think we can build something amazing together',
      timestamp: new Date('2026-03-22T10:00:00'),
    },

    // Chat 5: Alex & John
    {
      senderId: userIds[0],
      receiverId: userIds[4],
      text: 'Hey John! Sarah told me about your new venture. Congrats!',
      timestamp: new Date('2026-03-21T13:20:00'),
    },
    {
      senderId: userIds[4],
      receiverId: userIds[0],
      text: 'Thanks Alex! Would love to get your thoughts on our tech stack',
      timestamp: new Date('2026-03-21T13:35:00'),
    },
    {
      senderId: userIds[0],
      receiverId: userIds[4],
      text: 'Absolutely! I\'m always excited to chat about new tech. When are you free?',
      timestamp: new Date('2026-03-21T13:50:00'),
    },
    {
      senderId: userIds[4],
      receiverId: userIds[0],
      text: 'How about next Thursday? I can call you anytime',
      timestamp: new Date('2026-03-21T14:05:00'),
    },
  ];
};

async function addSampleData() {
  let client;

  try {
    console.log('🚀 Starting Data Insertion...\n');

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    const db = client.db('Chugli');
    const usersCollection = db.collection('users');
    const messagesCollection = db.collection('messages');

    // Step 1: Clear existing data
    console.log('🧹 Step 1: Clearing existing data...');
    await usersCollection.deleteMany({});
    await messagesCollection.deleteMany({});
    console.log('✅ Cleared existing users and messages\n');

    // Step 2: Insert sample users
    console.log('👥 Step 2: Adding 5 sample users...');
    const insertedUsers = await usersCollection.insertMany(sampleUsers);
    const userIds = Object.values(insertedUsers.insertedIds);
    console.log(`✅ Inserted ${insertedUsers.insertedIds.length} users\n`);
    console.log('Sample Users:');
    sampleUsers.forEach((user, idx) => {
      console.log(`  • ${user.fullName} (${user.email})`);
    });
    console.log();

    // Step 3: Insert sample messages
    console.log('💬 Step 3: Adding genuine chats and messages...');
    const sampleMessages = createSampleMessages(userIds);
    const insertedMessages = await messagesCollection.insertMany(sampleMessages);
    console.log(`✅ Inserted ${insertedMessages.insertedIds.length} messages\n`);

    // Step 4: Display chats summary
    console.log('📊 Step 4: Chat Summary\n');
    console.log('Chat 1: Alex Dev ↔️ Sarah Design');
    console.log('  │ Topic: Project design mockups');
    console.log('  └─ 4 messages\n');

    console.log('Chat 2: Alex Dev ↔️ Mike Tech');
    console.log('  │ Topic: API & WebSocket integration');
    console.log('  └─ 4 messages\n');

    console.log('Chat 3: Sarah Design ↔️ Emma Creative');
    console.log('  │ Topic: Weekend coffee plans');
    console.log('  └─ 4 messages\n');

    console.log('Chat 4: Mike Tech ↔️ John Startup');
    console.log('  │ Topic: Startup pitch & job offer');
    console.log('  └─ 4 messages\n');

    console.log('Chat 5: Alex Dev ↔️ John Startup');
    console.log('  │ Topic: Tech stack discussion');
    console.log('  └─ 4 messages\n');

    // Step 5: Get statistics
    console.log('📈 Step 5: Database Statistics\n');
    const userCount = await usersCollection.countDocuments();
    const messageCount = await messagesCollection.countDocuments();
    console.log(`✅ Total Users: ${userCount}`);
    console.log(`✅ Total Messages: ${messageCount}\n`);

    console.log('✨ All sample data added successfully!');
    console.log('🎉 Your app now has 5 genuine chats with realistic conversations!\n');

    console.log('📝 Login Credentials:');
    console.log('  • Email: alex@example.com | Password: password123');
    console.log('  • Email: sarah@example.com | Password: password123');
    console.log('  • Email: mike@example.com | Password: password123');
    console.log('  • Email: emma@example.com | Password: password123');
    console.log('  • Email: john@example.com | Password: password123\n');

    console.log('🌐 Go to http://localhost:5173 and try logging in!\n');

  } catch (error) {
    console.error('❌ Error occurred:', error.message);
    process.exit(1);

  } finally {
    if (client) {
      console.log('🔌 Closing connection...');
      await client.close();
      console.log('✅ Connection closed\n');
    }
  }
}

addSampleData();
