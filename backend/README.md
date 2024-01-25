<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Live Demo](#live-demo)
- [💻 Getting Started](#getting-started)
  - [Setup](#setup)
  - [Guide](#guide)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Usage](#usage)

<!-- PROJECT DESCRIPTION -->

# 📖 CRUISE WARE <a name="about-project"></a>

**Cruise Ware** is the warehouse/inventory management service for Cruise.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Backend</summary>
  <ul>
    <li><a href="https://expressjs.com/">Express</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://www.prisma.io/">Prisma </a></li>
    <li><a href="https://redis.io/">Redis</a></li>
  </ul>
</details>

<!-- Features -->

### Key Features <a name="key-features"></a>

- **Managing inventories**
- **Managing roles and permissions**
- **Managing action-entities**
- **Managing inventory inbounds**
- **Managing inventory outbounds**
- **Reporting and analytics**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

## 🚀 Live Demo <a name="live-demo"></a>

- [Coming soon...](https://google.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need:

- Latest version of Node
- Git installed
- MySQL installed
- Redis installed

### Guide
- [MySQL Installation](https://github.com/Codart-7/Codart-7/blob/main/dev_setup.md#mysql-setup)
- [Redis Instalation](https://github.com/Codart-7/Codart-7/blob/main/dev_setup.md#redis-setup)

### Setup

- Clone this repository to your desired folder and move to the working directory:

```sh
  cd my-folder
  git clone https://github.com/Codart-7/CruiseWare.git
  cd CruiseWare/backend
```

### Install

- Create the database using [create_db.sh](https://github.com/Codart-7/CruiseWare/blob/dev/backend/create_db.sh)
- Create a `.env` file following the format in [.env.example](https://github.com/Codart-7/CruiseWare/blob/dev/backend/.env.example) but with your own database credentials.

- Install dependencies and initialize the database:

```sh
  npm install
  npx prisma migrate deploy
```

### Usage

To run the project, execute the following command:

```sh
  npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
