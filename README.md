# 🛡️ Blockchain ID Verification System (BLCKCHN-VRFCTN)

A decentralized identity verification system built with **Hyperledger
Fabric**, **Node.js**, and **Streamlit**.\
This project allows users to securely upload and verify identification
documents (e.g., ID cards, certificates) by hashing and storing them on
a private blockchain network --- ensuring authenticity, immutability,
and transparency.

------------------------------------------------------------------------

## 🚀 Project Overview

The **Blockchain ID Verification System** aims to solve the problem of
fake or tampered identification documents by providing a
blockchain-powered validation mechanism.

When a user uploads a document, its **SHA-256 hash** is generated and
stored on **Hyperledger Fabric**.\
At any time, the same document can be re-uploaded to verify its
authenticity --- if the hash exists on-chain, the document is genuine.

------------------------------------------------------------------------

## 🧩 Key Features

-   🔐 **Document Upload:** Upload IDs or certificates to the system
    securely.\
-   🧮 **Hash Generation:** Each document is hashed using the SHA-256
    algorithm.\
-   ⛓️ **Blockchain Storage:** Hashes are stored immutably on
    Hyperledger Fabric.\
-   🔍 **Query & Verification:** Verify authenticity by querying user or
    document hashes.\
-   🖥️ **User Interface:** Streamlit-based UI for easy interaction with
    the backend.\
-   ☁️ **Cloud Deployable:** Backend hosted on Render; can also run
    locally.

------------------------------------------------------------------------

## 🧠 System Architecture

The project consists of three main layers:

1.  **Frontend Layer:**\
    Built with **Streamlit**, this layer handles user interactions ---
    file uploads, displaying results, and showing verification outcomes.

2.  **Backend Layer:**\
    A **Node.js/Express.js** server manages blockchain communication,
    processes file uploads, and handles API endpoints.

3.  **Blockchain Layer (Hyperledger Fabric):**\
    Responsible for maintaining the distributed ledger of hashed IDs.

------------------------------------------------------------------------

## ⚙️ System Requirements

### 🧰 Software Requirements

-   Node.js (v18+)
-   npm or yarn
-   Python 3.8+
-   Streamlit
-   Hyperledger Fabric binaries
-   Docker & Docker Compose (for Fabric setup)

### 💻 Hardware Requirements

-   8GB RAM minimum
-   20GB available disk space
-   Dual-core CPU or higher

------------------------------------------------------------------------

## 🧱 Project Structure

    BLCKCHN-VRFCTN/
    │
    ├── fabric/                      # Hyperledger Fabric network configuration
    │   ├── api/                     # Node.js API for blockchain interaction
    │   ├── connection-profile/      # Network connection and credentials
    │   └── chaincode/               # Smart contract logic
    │
    ├── streamlit_app/               # Frontend Streamlit interface
    │   └── app.py
    │
    ├── package.json                 # Node.js dependencies
    ├── server.js                    # Backend entry point
    ├── README.md                    # Project documentation
    └── .gitignore

------------------------------------------------------------------------

## 🔄 Workflow Overview

1.  User uploads an ID or certificate file.\
2.  The system computes the file's **SHA-256 hash**.\
3.  The backend records this hash on the **Hyperledger Fabric**
    blockchain.\
4.  To verify, the user re-uploads the document or enters a User ID.\
5.  The system compares the hash to stored blockchain entries.\
6.  If found --- ✅ *Valid ID*; otherwise --- ❌ *Not registered*.

------------------------------------------------------------------------

## 🧰 Installation & Setup

### 🪜 Clone the Repository

``` bash
git clone https://github.com/userIssa/BLCKCHN-VRFCTN.git
cd BLCKCHN-VRFCTN
```

### 📦 Backend Setup

``` bash
cd fabric
npm install
node server.js
```

### 🌐 Frontend Setup

``` bash
cd streamlit_app
pip install -r requirements.txt
streamlit run app.py
```

> Ensure your backend (`server.js`) is running before launching the
> frontend.

------------------------------------------------------------------------

## ☁️ Deployment (Optional)

The backend can be hosted on **Render**, **AWS**, or **Heroku**.\
Ensure environment variables are configured correctly:

``` bash
PORT=10000
FABRIC_CONFIG_PATH=./connection-profile/network-connection.yaml
```

The frontend Streamlit app can be deployed on **Streamlit Cloud** or
**Render** as well.

------------------------------------------------------------------------

## 📊 System Design Summary

-   **Use Case Diagram** --- Shows system-user interaction.
-   **Activity Diagram** --- Illustrates process flow from upload to
    verification.
-   **Sequence Diagram** --- Describes component communication.
-   **Class Diagram** --- Represents backend data structure.
-   **ERD Diagram** --- Database representation for metadata storage.
-   **Architecture Diagram** --- High-level system structure.

*All diagrams available in `/diagrams` folder.*

------------------------------------------------------------------------

## 🧪 Example API Endpoints

### **Upload File**

    POST /upload
    Body: { userId, file }
    Response: { message: "File uploaded successfully." }

### **Query by User ID**

    GET /query/:userId
    Response: { userId, hashValue }

------------------------------------------------------------------------

## 📚 Technologies Used

  Layer        Technology
  ------------ -----------------------
  Frontend     Streamlit (Python)
  Backend      Node.js, Express.js
  Blockchain   Hyperledger Fabric
  Hashing      SHA-256
  Storage      CouchDB / File System
  Deployment   Render Cloud

------------------------------------------------------------------------

## 👨‍💻 Author

**Toluwanimi "Issa" Oderinde**\
Cybersecurity Generalist & Software Engineer\
[GitHub](https://github.com/userIssa) •
[LinkedIn](https://linkedin.com/in/toluwanimi-oderinde)

------------------------------------------------------------------------

## 🧾 License

This project is licensed under the **MIT License** --- you're free to
use, modify, and distribute with attribution.

------------------------------------------------------------------------

## ❤️ Acknowledgements

-   **Hyperledger Foundation** for open-source blockchain tools.\
-   **Streamlit** for rapid front-end prototyping.\
-   **Render** for cloud deployment.\
-   Special thanks to mentors and contributors.

------------------------------------------------------------------------

> *"Blockchain doesn't just protect data --- it protects truth."*
