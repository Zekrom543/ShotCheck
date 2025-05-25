import os
import io
import re
from flask import Flask, request, jsonify, send_from_directory
import PyPDF2

# ─── Configure paths ─────────────────────────────────────────────────────────────
# BASE_DIR = project root (one level up from this file)
BASE_DIR      = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FRONTEND_DIR  = os.path.join(BASE_DIR, 'frontend')

# ─── Create Flask app ────────────────────────────────────────────────────────────
app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,   # point Flask at ../frontend
    static_url_path=''            # serve it at /
)

# ─── Routes ─────────────────────────────────────────────────────────────────────
@app.route('/')
def index():
    # serve frontend/index.html
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:filename>')
def assets(filename):
    # serve style.css, script.js, images, etc.
    return send_from_directory(FRONTEND_DIR, filename)

@app.route('/upload_shot_list', methods=['POST'])
def upload_shot_list():
    if 'shotListPdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    file = request.files['shotListPdf']
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

    try:
        pdf_buf = io.BytesIO(file.read())
        shots = parse_pdf_shot_list(pdf_buf)
        return jsonify({"shots": shots}), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {e}"}), 500

# ─── PDF parsing helper ─────────────────────────────────────────────────────────
def parse_pdf_shot_list(pdf_file):
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        full_text = "".join(page.extract_text() or "" for page in reader.pages)
    except Exception as e:
        return [{"description": f"Error parsing PDF: {e}", "checked": False}]

    pattern = r"(?:(?:\d+\.)|-)\s*([\s\S]*?)(?=(?:\d+\.)|-|$)"
    matches = re.findall(pattern, full_text)

    shots = []
    for block in matches:
        desc = ' '.join(block.split())
        if desc:
            shots.append({"description": desc, "checked": False})

    if not shots:
        return [{"description": "No shots found in PDF after processing.", "checked": False}]
    return shots

# ─── Run ─────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    # Make sure you run this from the project root (so BASE_DIR/frontend exists)
    app.run(host='0.0.0.0', port=5001, debug=True)
