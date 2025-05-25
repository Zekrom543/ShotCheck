# Shot Check

A small Flask-based web app that lets you upload a PDF shot list and displays each shot as a checklist in the browser.

## 🚀 Features

- **PDF Upload & Parsing**  
  Uses PyPDF2 to extract text and split into individual shot descriptions  
- **Frontend**  
  Static HTML/CSS/JS served from frontend/  
- **Shot Checklist**  
  Displays each parsed shot with a checkbox you can tick off  

## 🛠️ Tech Stack

- **Backend:** Python 3, Flask, PyPDF2  
- **Frontend:** HTML5, CSS3, JavaScript  
- **Deployment-friendly:** Configured for hosting on Render, Replit, PythonAnywhere  

## 📂 Project Structure

shotcheck/  
├── backend/  
│   └── main.py       # Flask app + PDF parsing logic  
├── frontend/         # static files (index.html, style.css, script.js)  
├── requirements.txt  
└── README.md         # this file  

## 💻 Installation

1. Clone the repo  
   git clone https://github.com/YourUser/shotcheck.git  
   cd shotcheck  

2. Create & activate a virtual environment  
   python3 -m venv venv  
   source venv/bin/activate   # Mac/Linux  

   On Windows PowerShell:  
   python -m venv venv  
   .\venv\Scripts\Activate  

3. Install dependencies  
   pip install -r requirements.txt  

## ▶️ Usage

Run the server locally:  
python backend/main.py  

Then open http://localhost:5001 in your browser.

## 🚢 Deployment

You can deploy this app for free on platforms like Render, Replit, or PythonAnywhere. See the project docs for detailed setup instructions.

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch: git checkout -b feature/YourFeature  
3. Commit your changes: git commit -m "Add YourFeature"  
4. Push to the branch: git push origin feature/YourFeature  
5. Open a Pull Request  

## 📝 License

MIT © Your Name
