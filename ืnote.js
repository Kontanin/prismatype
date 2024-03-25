// Import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Define a function to insert data into the database
async function insertData() {
  try {
    // Insert data into Orders table
    const order = await prisma.orders.create({
      data: {
        customer: { connect: { id: 1 } },
        order_date: new Date(),
        total_amount: 45.00,
      },
    });

    // Insert data into OrderItems table
    await prisma.orderItems.createMany({
      data: [
        { order_id: order.id, product_id: 101, quantity: 2, unit_price: 20.00 },
        { order_id: order.id, product_id: 102, quantity: 1, unit_price: 15.00 },
      ],
    });

    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
}

// Call the function to insert data
insertData();




// var mysql = require('mysql');
// var conn = mysql.createConnection({
//     ...
// });

// var sql = "INSERT INTO Test (name, email, n) VALUES ?";
// var values = [
//     ['demian', 'demian@gmail.com', 1],
//     ['john', 'john@gmail.com', 2],
//     ['mark', 'mark@gmail.com', 3],
//     ['pete', 'pete@gmail.com', 4]
// ];
// conn.query(sql, [values], function(err) {
//     if (err) throw err;
//     conn.end();
// });