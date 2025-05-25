#  Mobile Phone Online Store - FullStack App

A fast, scalable, and user-friendly e-commerce platform for browsing and managing mobile phones.

🚀 Features
- 🔍 Search & Filter: Easily find phones by brand, specs, or price range
- 🛒 Shopping Cart: Seamless checkout experience
- ⭐ User Reviews: Customers can rate and review products
- 📦 Order Management: Track orders and purchase history
- 🔐 Secure Authentication: Login & payment security with Bearer tokens
- 📊 Optimized Backend: Efficient API requests and state trackin

⚙️ Tech Stack
- Frontend: React.js, Redux Toolkit
- Backend: Node.js, Express, Sequelize
- Database: PostgreSQL/MySQL
- Authentication: JWT/Bearer tokens
- HTTP Client: Axios

## 📁 Project Structure

/Mobile Phones Online Store 

├── frontend/ 

├── backend/

└── README.md # You're here!


📦 Installation

Clone the repository

```bash
git clone https://github.com/abtargus7/Mobile-Phones-Online-Store.git
cd Mobile-Phones-Online-Store
```


🔧 1. Setup Backend


## Install dependencies
```bash
cd server
npm install
```

Create ```.env``` file in  ```/server```:

```bash
PORT=4000
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_DATABASE =your-database-name
DB_HOST =your-db-host
DB_PORT =your-db-port
NODE_ENV =development
ACCESS_TOKEN_SECRET=your-access-token-secret
```


## Start PostgreSQL

Before running the server, make sure PostgreSQL is installed and running:

- Mac/Linux:
```bash
sudo systemctl start postgresql
```

- Windows(using pgAdmin, CMD):
    Open pgAdmin and start the PostgreSQL server, or use:
```bash
net start postgresql
```

- Setup Database
Create the database manually or via Sequelize migrations:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```


## Run the backend:

```bash
npm run dev
```
This starts the backend on ```http://localhost:5000```


🎨 2. Setup Frontend


## Move to client directory
```bash
cd client
```


## Install Dependencies
```bash
npm install
```


## Start the frontend dev server:
```bash
npm run dev
```


🌐 API Endpoints


## User Endpoints

- Sign up:
```POST /api/v1/user/signup```

- Login:
```POST /api/v1/user/login```

- Log out:
```POST /api/v1/user/logout```


## Product Endpoints

- Fetch all Products:
  ```GET /api/v1/product```

- Fetch a product:
  ```GET /api/v1/product/:id```

- Fetch products created by user:
  ```GET /api/v1/product/user```

- Create a Product:
  ```POST /api/v1/product```

- Update a product:
  ```PUT /api/v1/product/:id```

- Delete a product:
  ```DELETE /api/v1/product/:id```

- Update product variants:
  ```PUT /api/v1/product/:id/variants```

- Update product images:
  ```PUT /api/v1/product/:id/images```

  















