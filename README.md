🦅 AI Vision Monitoring System
AI Vision Banner
React
Ant Design
License
PRs Welcome

📋 Overview
AI Vision is an advanced camera monitoring system powered by artificial intelligence for real-time surveillance, anomaly detection, and analytics. Our platform brings enterprise-grade security capabilities with an intuitive interface accessible across all devices.

Dashboard Preview
✨ Key Features
🎥 Multi-Camera Management - Connect and manage unlimited cameras across multiple locations
🧠 AI-Powered Detection - Identify objects, people, vehicles, and custom defined triggers
⚡ Real-Time Alerts - Instant notifications for security events via multiple channels
📊 Advanced Analytics - Comprehensive dashboards with heatmaps, counts, and behavioral insights
📱 Responsive Design - Seamless experience across desktop, tablet, and mobile devices
🔐 Role-Based Access - Granular permission system for teams of any size
🌐 Cloud & On-Premise - Flexible deployment options to match your security requirements
🔄 Customizable Workflows - Define automated responses to detected events
🚀 Getting Started
Prerequisites
Node.js 16.0 or later
npm or yarn
Modern web browser
Installation
Clone the repository
BASH

git clone https://github.com/Bharatveersingh-K/AI-Vision.git
cd ai-vision
Install dependencies
BASH

npm install
# or
yarn install
Set up environment variables
BASH

cp .env.example .env
# Edit .env with your configuration
Start the development server
BASH

npm run dev
# or
yarn start
Build for production
BASH

npm run build
# or
yarn build
🖥️ Technology Stack
Frontend: React, Ant Design, Framer Motion
State Management: Context API
Authentication: JWT with HttpOnly cookies
Styling: CSS-in-JS, Tailwind CSS (optional)
API Communication: Axios
Monitoring: Sentry (optional)
Testing: Jest, React Testing Library
📱 Responsive Design
AI Vision is designed to work beautifully across all devices:

Desktop	Tablet	Mobile
		
🧩 Component Architecture
The system is built with a modular component architecture:

Layout - Responsive shell with Sidebar and Header
Sidebar - Collapsible navigation with intelligent menu structure
Camera Monitor - Real-time video streams with AI overlays
Dashboard - Analytics and system overview
User Management - Role-based access control
Prompt Management - Configure AI detection parameters
⚙️ Configuration
AI Vision can be configured through the .env file:

ENV

# API Configuration
REACT_APP_API_URL= https://aivisionapi.mikrowsoft.com/swagger/index.html
REACT_APP_API_VERSION=v1

# Authentication
REACT_APP_AUTH_COOKIE_NAME=ai_vision_token
REACT_APP_AUTH_COOKIE_DOMAIN=example.com

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true

# Video Processing
REACT_APP_MAX_CAMERA_RESOLUTION=1080p
REACT_APP_FPS_LIMIT=30
📝 API Documentation
Our REST API documentation is available at:

Development: http://localhost:3000/api-docs
Production: https://aivisionapi.mikrowsoft.com/swagger/index.html
🤝 Contributing
We welcome contributions! Please see our contributing guidelines for details.

Development Workflow
Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add some amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🔮 Roadmap
 🌙 Dark mode support
 🔊 Audio analytics for sound detection
 🔄 Integration with third-party security systems
 🌐 Multi-language support
 📱 Native mobile applications
 🤖 Advanced behavioral AI models
🛠️ Troubleshooting
Common issues and their solutions:

Issue	Solution
Camera not connecting	Ensure proper network settings and RTSP URL format
High CPU usage	Adjust video quality settings in configuration
Authentication errors	Clear cookies and verify account permissions
📊 Screenshots
Login Page: https://drive.google.com/file/d/14SyzsEJkn1i404fV00prIiWnhGraMQnO/view?usp=sharing
Analytics DashboardCamera Monitor: https://drive.google.com/file/d/1TkBkTwQ_9qWZ0yqjsrlv1GTbY_zuaiu4/view?usp=sharing

Resposiveness for mobile Screen: https://drive.google.com/file/d/1WNoRrPkFSsoWJ_qDaZSCeqkoMCO5RuJG/view?usp=sharing

Settings PanelUser Management
📞 Support
Need help? Contact us:

📧 Email: bharatveersingh271@gmail.com
💬 Chat: Available within the application
📚 Documentation: not avialble for now
✨ Acknowledgements
React - UI Library
Ant Design - Design System
TensorFlow.js - Machine Learning
FFmpeg - Video Processing
Built with ❤️ by the AI Vision Team