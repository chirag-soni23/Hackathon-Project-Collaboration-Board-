import streamlit as st
import requests
import graphviz
import jwt
import os
from dotenv import load_dotenv

# Load .env values
load_dotenv()
API_URL = os.getenv("API_URL", "http://localhost:5000/api")
JWT_SECRET = os.getenv("JWT_SECRET")

# JWT decoding
def decode_jwt(token):
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

# Streamlit setup
st.set_page_config(page_title="Sticky Notes App", layout="wide")
st.title("Sticky Notes - Tree View with Graphviz")

if "jwt_token" not in st.session_state:
    st.session_state.jwt_token = None

with st.sidebar:
    st.header("Login")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        res = requests.post(f"{API_URL}/user/login", json={"email": email, "password": password})
        if res.status_code == 200:
            data = res.json()
            token = data.get("token")
            if token:
                decoded = decode_jwt(token)
                if "error" in decoded:
                    st.error(f"JWT Error: {decoded['error']}")
                else:
                    st.session_state.jwt_token = token
                    st.session_state.user_id = decoded["id"]
                    st.success("Login successful")
                    st.rerun()
            else:
                st.error("Token not found in response JSON.")
        else:
            st.error(res.json().get("message", "Login failed"))

if st.session_state.jwt_token:
    headers = {"Authorization": f"Bearer {st.session_state.jwt_token}"}

    # Get user info
    user_res = requests.get(f"{API_URL}/user/me", headers=headers)
    if user_res.status_code != 200:
        st.error("Failed to fetch user profile.")
        st.code(user_res.text)
        st.stop()

    user = user_res.json()
    user_name = user["name"]
    user_id = user["_id"]

    st.success(f"Welcome, {user_name}")
    st.info(f"Verified User ID from Token: {st.session_state.user_id}")

    # Get notes
    notes_res = requests.get(f"{API_URL}/notes", headers=headers)
    if notes_res.status_code != 200:
        st.error("Failed to fetch sticky notes.")
        st.code(notes_res.text)
        st.stop()

    notes = notes_res.json()
    user_notes = [note for note in notes if note["user"]["_id"] == user_id]

    st.subheader("Note Summary")
    st.markdown(f"Total sticky notes: {len(user_notes)}")

    st.subheader("User to Sticky Notes Tree Diagram")

    g = graphviz.Digraph()
    g.attr(rankdir="TB", splines="true")

    # User node
    g.node("User", user_name, shape="ellipse", style="filled", fillcolor="#FCD34D")

    # Sticky notes
    for i, note in enumerate(user_notes):
        note_id = f"Note{i}"
        note_text = note["text"].strip().replace("\n", " ")[:30] or "(empty)"
        note_color = note.get("color", "#A5F3FC")
        g.node(note_id, note_text, shape="box", style="filled", fillcolor=note_color)
        g.edge("User", note_id, label="created")

    st.graphviz_chart(g)

    with st.expander("View all notes"):
        for note in user_notes:
            st.markdown(f"- Text: `{note['text']}` | Color: `{note['color']}` | Position: ({note['x']},{note['y']})")

    if st.button("Logout"):
        st.session_state.jwt_token = None
        st.session_state.user_id = None
        st.rerun()
else:
    st.info("Please login from the sidebar to view your notes.")
