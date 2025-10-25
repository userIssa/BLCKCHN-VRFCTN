import streamlit as st
import requests
import hashlib
from PIL import Image
import io

# ---------------------------
# Backend Configuration
# ---------------------------
BACKEND_URL = "https://blckchn-vrfctn.onrender.com"  
#----------------------------

st.set_page_config(page_title="ID Validation Blockchain", layout="centered")

st.title("🛡️ Blockchain ID Verification")
st.markdown(
    "Upload your ID or certificate image, and we'll store its hash securely on Hyperledger Fabric. "
    "You can also query your uploaded ID to verify it."
)

# ---------------------------
# Upload section
# ---------------------------
st.header("Upload Document")
uploaded_file = st.file_uploader("Choose a file (PNG/JPG/JPEG/PDF)", type=["png", "jpg", "jpeg", "pdf"])
user_id = st.text_input("User ID", "")

file_hash = None
if uploaded_file:
    file_bytes = uploaded_file.getvalue()
    file_hash = hashlib.sha256(file_bytes).hexdigest()
    
    # Show file preview if image
    if uploaded_file.type.startswith("image"):
        image = Image.open(io.BytesIO(file_bytes))
        st.image(image, caption="Preview", use_container_width=True)
    
    st.info(f"SHA-256 Hash: `{file_hash}`")

if st.button("Upload") and uploaded_file and user_id:
    files = {"file": (uploaded_file.name, uploaded_file.getvalue())}
    data = {"userId": user_id}
    try:
        response = requests.post(f"{BACKEND_URL}/upload", files=files, data=data)
        if response.status_code == 200:
            st.success(response.json().get("message"))
        else:
            st.error(response.json().get("error", "Upload failed"))
    except Exception as e:
        st.error(f"Error: {e}")

# ---------------------------
# Query section
# ---------------------------
st.header("Query Document Hash")
query_user_id = st.text_input("Enter User ID to Query", "")

if st.button("Query") and query_user_id:
    try:
        response = requests.get(f"{BACKEND_URL}/query/{query_user_id}")
        if response.status_code == 200:
            record = response.json()
            st.success(f"User ID: {record['userId']}\nHash: {record['hashValue']}")
        else:
            st.error(response.json().get("error", "Query failed"))
    except Exception as e:
        st.error(f"Error: {e}")

# ---------------------------
# Footer
# ---------------------------
st.markdown("---")
st.markdown("Built with ❤️ by Issa | Hyperledger Fabric Demo")
