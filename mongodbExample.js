import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: './backend/.env' });

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGO_URI;

// Validate that the connection URI is provided
if (!MONGODB_URI) {
  console.error('❌ Error: MONGO_URI is not set in .env file');
  process.exit(1);
}

// Helper function to generate realistic chat app data
function generateChatMessages() {
  const users = ['Alice', 'Bob', 'Charlie', 'David', 'Emma'];
  const messages = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    messages.push({
      sender: users[Math.floor(Math.random() * users.length)],
      recipient: users[Math.floor(Math.random() * users.length)],
      content: `This is message number ${i + 1}. How are you doing today?`,
      timestamp: new Date(now.getTime() - (10 - i) * 60000), // Spread over 10 minutes
      read: Math.random() > 0.5,
    });
  }
  return messages;
}

// Main function to connect and test MongoDB
async function connectAndTestMongoDB() {
  let client;

  try {
    console.log('🚀 Starting MongoDB Atlas Connection Test...\n');

    // Step 1: Create MongoClient instance
    console.log('📝 Step 1: Creating MongoDB client...');
    client = new MongoClient(MONGODB_URI);

    // Step 2: Connect to MongoDB
    console.log('🔗 Step 2: Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!\n');

    // Step 3: Access database and collection
    console.log('📂 Step 3: Accessing database and collection...');
    const db = client.db('Chugli');
    const messagesCollection = db.collection('messages');
    console.log('✅ Connected to "Chugli" database, "messages" collection\n');

    // Step 4: Clear existing data (optional - for fresh test)
    console.log('🧹 Step 4: Clearing existing documents (for fresh test)...');
    await messagesCollection.deleteMany({});
    console.log('✅ Cleared existing documents\n');

    // Step 5: Insert sample documents
    console.log('💾 Step 5: Inserting 10 sample chat messages...');
    const sampleMessages = generateChatMessages();
    const insertResult = await messagesCollection.insertMany(sampleMessages);
    console.log(`✅ Inserted ${insertResult.insertedIds.length} documents\n`);
    console.log('Sample inserted IDs:', insertResult.insertedIds, '\n');

    // Step 6: Read and display 5 most recent messages
    console.log('📖 Step 6: Reading 5 most recent messages (sorted by timestamp)...');
    const recentMessages = await messagesCollection
      .find({})
      .sort({ timestamp: -1 }) // Sort descending (-1 = newest first)
      .limit(5)
      .toArray();

    console.log(`✅ Found ${recentMessages.length} recent messages:\n`);
    recentMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. ${msg.sender} → ${msg.recipient}`);
      console.log(`     Message: "${msg.content}"`);
      console.log(`     Sent at: ${msg.timestamp.toISOString()}`);
      console.log(`     Read: ${msg.read}\n`);
    });

    // Step 7: Read one document by _id
    console.log('🔍 Step 7: Reading a single document by ID...');
    if (insertResult.insertedIds.length > 0) {
      const firstId = insertResult.insertedIds[0];
      const singleMessage = await messagesCollection.findOne({ _id: firstId });

      if (singleMessage) {
        console.log('✅ Found document:\n');
        console.log(`  From: ${singleMessage.sender}`);
        console.log(`  To: ${singleMessage.recipient}`);
        console.log(`  Message: "${singleMessage.content}"`);
        console.log(`  Timestamp: ${singleMessage.timestamp.toISOString()}`);
        console.log(`  Status: ${singleMessage.read ? 'Read' : 'Unread'}\n`);
      }
    }

    // Step 8: Get collection statistics
    console.log('📊 Step 8: Collection Statistics...');
    const stats = await db.collection('messages').countDocuments();
    console.log(`✅ Total documents in collection: ${stats}\n`);

    console.log('✅ All tests completed successfully! Your MongoDB connection is working!\n');

  } catch (error) {
    console.error('❌ Error occurred:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);

  } finally {
    // Step 9: Close connection
    if (client) {
      console.log('🔌 Closing MongoDB connection...');
      await client.close();
      console.log('✅ Connection closed\n');
    }
  }
}

// Run the test
connectAndTestMongoDB();
