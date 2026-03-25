import { PortfolioData, Translations } from './types';

export const DEFAULT_DATA: PortfolioData = {
  brandHeadline: "CVK Engineering & Automation Solutions",
  brandAbout: "CVK is a leading provider of industrial automation, precision engineering, and custom software solutions. We bridge the gap between complex industrial challenges and innovative technological solutions.",
  services: [
    {
      id: 's1',
      title: "Industrial Automation",
      description: "Custom PLC, HMI, and SCADA solutions for manufacturing and production lines.",
      icon: "Settings"
    },
    {
      id: 's2',
      title: "Precision Engineering",
      description: "Design and development of custom electronic control units and mechanical components.",
      icon: "Code"
    },
    {
      id: 's3',
      title: "Web Design & Development",
      description: "Robust e-commerce platforms and production management systems tailored to your business.",
      icon: "Globe"
    },
    {
      id: 's4',
      title: "Automation System Development",
      description: "End-to-end development of automated systems for industrial and commercial applications.",
      icon: "Cpu"
    },
    {
      id: 's5',
      title: "Home Automation",
      description: "Smart home solutions for lighting, security, and climate control using IoT technologies.",
      icon: "Home"
    }
  ],
  headline: "Automation Engineer & Web Developer. I build industrial Production Management Systems, robust e-commerce platforms, and custom electronic control units.",
  aboutMe: "I am an ambitious undergraduate student with a passion for automation, a range of leadership skills, and a dedication to personal growth. I am excited to embark on new challenges and make valuable contributions to the field of automation. I am seeking an internship opportunity in automation to apply my skills and knowledge, and to gain practical experience in the field.",
  contact: {
    email: "chandeepavidusarakumarasiri@gmail.com",
    phone: "+94 70 501 5288",
    location: "Mahimulla, Keembiela, Poddala, Galle, Sri Lanka. 8000.",
    linkedin: "linkedin.com/in/chandeepa-vidusara/"
  },
  projects: [
    {
      id: '1',
      category: "Industrial Systems",
      title: "Production Management System",
      description: "A comprehensive system for tracking production lines, worker efficiency, and inventory management at Eco Solve (Pvt) Ltd.",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      longDescription: "This project involved designing and implementing a full-scale Production Management System (PMS) for Eco Solve (Pvt) Ltd. The system tracks real-time production data, monitors worker efficiency using IoT devices, and manages inventory levels to optimize the manufacturing process. Key features include automated reporting, real-time dashboard visualization, and integration with existing hardware.",
      media: [
        { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", type: 'image' },
        { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", type: 'video' }
      ]
    },
    {
      id: '2',
      category: "Electronics",
      title: "High-Power Controller",
      description: "Custom ECU designed for high-current industrial applications with robust protection circuits and ESP32 integration.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      longDescription: "Designed a custom Electronic Control Unit (ECU) capable of handling high-current loads for industrial machinery. The unit features an ESP32 microcontroller for wireless monitoring and control, integrated thermal protection, and short-circuit safeguards. The PCB was designed using SolidWorks Electrical and AutoCAD for precision and reliability.",
      media: [
        { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80", type: 'image' }
      ]
    },
    {
      id: '3',
      category: "Data Visualization",
      title: "LiDAR Data Web App",
      description: "Real-time visualization of LiDAR point cloud data for spatial analysis and mapping using web technologies.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      longDescription: "Developed a web-based application to visualize and analyze LiDAR point cloud data in real-time. The app uses Three.js for 3D rendering and allows users to perform spatial analysis, distance measurements, and terrain mapping directly in the browser. This tool is designed for surveyors and engineers to quickly assess spatial data without specialized software.",
      media: [
        { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", type: 'image' }
      ]
    },
    {
      id: '4',
      category: "E-commerce",
      title: "GadgetLK E-commerce",
      description: "A feature-rich online store for electronic gadgets with integrated payment and tracking, optimized for SEO.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      longDescription: "GadgetLK is a custom-built e-commerce platform tailored for the electronics market in Sri Lanka. It features a robust product management system, integrated payment gateways, real-time order tracking, and advanced SEO optimization. The platform is designed to handle high traffic and provide a seamless shopping experience across all devices.",
      media: [
        { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", type: 'image' }
      ]
    }
  ],
  posts: [
    {
      id: 'p1',
      text: "Proud to share that I have successfully completed the Foundation Diploma in English from Eurasian Campus - Sri Lanka!",
      media: [
        { url: "https://ais-pre-jl7iqjm4lvrm25xwxpl7o5-97827507355.asia-southeast1.run.app/api/placeholder/800/600", type: 'image' }
      ],
      date: "3 months ago"
    }
  ],
  personalImages: [
    "https://media.licdn.com/dms/image/v2/D5603AQHi4U2qZOS40Q/profile-displayphoto-shrink_400_400/B56Zkvg8OYHMAk-/0/1757438789898?e=1776297600&v=beta&t=yVS-v7nC8g-thZoamRpI4ZoyNTOuxGEomCeXJd0SzGc"
  ],
  cv: {
    personalInfo: {
      fullName: "CHANDEEPA KUMARASIRI",
      dob: "September 17, 1999",
      nic: "992612096V",
      nationality: "Sri Lankan"
    },
    technicalSkills: [
      { category: "Programming & Software Development", skills: "Python, Java, C#, Ladder Logic, Flask" },
      { category: "Automation & Industrial Control", skills: "PLC Programming, HMI Development, SCADA Systems, Industrial Communication, Arduino, Raspberry Pi, ESP32, STM32, Sensor & Actuator Integration, Motor Drivers" },
      { category: "Design & Simulation", skills: "AutoCAD, SolidWorks, Electrical & Circuit Design, PCB Design" },
      { category: "Industrial Systems", skills: "Pneumatic System Design, Computer Vision, Robotics" }
    ],
    professionalSkills: [
      "Communication Skills",
      "Leadership",
      "Time Management",
      "Project Management",
      "Problem-Solving"
    ],
    experience: [
      {
        title: "Executive-Process Development",
        period: "March. 2025 – Present",
        company: "Eco Solve (Pvt) Ltd",
        location: "Kandana, Sri Lanka",
        bullets: [
          "Spearheaded automation, production management, and product development initiatives, including a Mitsubishi PLC-based aluminum bar cutter, a microcontroller-driven heat sleeves cutter, CNC machine training, 5S implementation, LED product enhancements, PCB design, Python-based tool development, and a custom production management system to streamline factory operations."
        ]
      },
      {
        title: "Intern - Research and Development Department",
        period: "Aug. 2023 – Jan. 2024",
        company: "D Samson Industries (Pvt) Ltd",
        location: "Galle, Sri Lanka",
        bullets: [
          "Led the development of the RFID Vehicle Management System, Heat Transfer Sticker Printing Machine, Automatic Slipper Drilling Machine, and CNC Elastic Marking and Cutting Machine.",
          "Engineered 3D models to upgrade the Screen-Printing Machine using SolidWorks.",
          "Programmed microcontrollers, integrated pneumatic and hydraulic systems, and executed welding tasks while ensuring compliance with strict health and safety guidelines."
        ]
      },
      {
        title: "Quality Checker",
        period: "2019 – 2020",
        company: "Star Garment (Pvt) Ltd",
        location: "Baddegama, Sri Lanka",
        bullets: [
          "Gained hands-on experience in garment production processes and floor operations.",
          "Worked closely with fabric handling and applied quality standards to ensure defect-free output.",
          "Learned about garment quality control techniques and product inspection methods."
        ]
      },
      {
        title: "Assistant Accountant",
        period: "2018 – 2019",
        company: "Little Lanka (Pvt) Ltd",
        location: "Dodangoda, Sri Lanka",
        bullets: [
          "Assisted with accounting documentation, invoice preparation, and record management.",
          "Gained foundational knowledge of accounting procedures and administrative coordination."
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Engineering Technology in Instrumentation and Automation (Hons)",
        period: "Feb. 2020 – Dec.2024",
        institution: "University of Colombo",
        location: "Colombo, Sri Lanka",
        bullets: [
          "GPA: 3.05/4.00",
          "Coursework: Technical Drawing & CAD, Microcontrollers, PLCs, Electricity & Magnetism, Sensors & Transducers, FPGA, Industrial Automation, Shielding & Protection, Nuclear & Medical Instrumentation, Research Project."
        ]
      },
      {
        degree: "Diploma in English",
        period: "Jan. 2025 – Feb. 2025",
        institution: "Sri Lanka English Language Graduates’ Association",
        location: "Kadawatha, Sri Lanka",
        bullets: [
          "Completed a certified English language diploma focused on grammar, communication, and academic writing."
        ]
      },
      {
        degree: "Certificate Course in HTML / CSS / Python",
        period: "2022",
        institution: "Sololearn",
        location: "Online"
      },
      {
        degree: "Certificate Course in English",
        period: "2019",
        institution: "National Vocational Training Institute",
        location: "Baddegama"
      },
      {
        degree: "Certificate Course in Graphic Design",
        period: "2017",
        institution: "Future World IPS",
        location: "Baddegama"
      },
      {
        degree: "G.C.E. Advanced Level Examination",
        period: "2018 Engineering Technology Stream (1906640)",
        institution: "St. Anthony's (National) College",
        location: "Baddegama",
        bullets: [
          "Z-Score: 2.0285 | Island Rank: 220 | District Rank: 20"
        ]
      }
    ],
    memberships: [
      { role: "Member", organization: "Sport Club, Faculty of Technology, University of Colombo", period: "2023 - 2024" },
      { role: "Member", organization: "Colombo Beacon, University of Colombo", period: "2022 - 2024" },
      { role: "Member", organization: "Innovation Club, Faculty of Technology, University of Colombo", period: "2023 - Present" },
      { role: "Member", organization: "The Buddhist Society, Faculty of Technology, University of Colombo", period: "2023 - Present" }
    ],
    interests: [
      "Artificial intelligence",
      "Robotics",
      "PLC programming",
      "Industrial internet of things",
      "Smart manufacturing"
    ],
    languages: [
      { name: "Sinhala", level: 100 },
      { name: "English", level: 85 }
    ],
    references: [
      {
        name: "Dr. Chathurika Silva",
        title: "Senior Lecturer | Department of Instrumentation and Automation Technology, Faculty of Technology, University of Colombo",
        email: "chathurika@iat.cmb.ac.lk",
        phone: "+94 77 184 7833"
      },
      {
        name: "Dr. K.D.R.N. Kalubowila",
        title: "Senior Lecturer | Department of Instrumentation and Automation Technology, Faculty of Technology, University of Colombo",
        email: "ruwan@iat.cmb.ac.lk",
        phone: "+94 77 231 3923"
      }
    ],
    cvProjects: [
      {
        title: "Final Year Research: UAV-Based Remote Sensing for Field-Based Crop Management",
        description: "Developed a UAV-based system for early paddy disease detection using low-cost RGB imagery and machine learning. The project involved designing a quadcopter, developing disease detection models, and creating a web application for user accessibility.",
        bullets: [
          "Tools & Technologies: STM32F411CEU6, Raspberry Pi Camera, MPU6050, BMP280, GY-271, Neo6M GPS, Flask, Machine Learning, Random Forest Classifier, OpenCV.",
          "Role & Responsibilities: Component selection, circuit & PCB design, wiring, STM32 programming, 3D modeling, manual PCB printing, and documentation.",
          "Achievement: 1st Runner-Up in the Research and Innovation Exhibition at the 8th Annual Research Symposium, Faculty of Technology, University of Colombo, 2024."
        ]
      },
      {
        title: "RFID Door Lock System with Mobile Application",
        description: "Developed a door lock system that uses RFID technology to grant access to authorized individuals. The system is controlled through a mobile application.",
        bullets: [
          "Tools & Technologies: Arduino, RFID Reader, Relay Module, NodeMCU, ESP8266, Android Studio, Java.",
          "Role & Responsibilities: System design, circuit development, microcontroller programming, mobile app integration, and network communication setup.",
          "Achievement: Presented at the University Annual Research Symposium 2023 Exhibition."
        ]
      },
      {
        title: "Automatic Bar Cutter Machine",
        description: "Designed and developed a fully automated aluminum bar cutter capable of handling 3600 mm bars and cutting lengths from 30 mm to 600 mm (bar diameter: 25-100 mm), using Mitsubishi PLC, stepper motors, sensors, and pneumatics, featuring auto length adjustment, feeding, gripping, and cutting to maximize efficiency and minimize manual error."
      },
      {
        title: "Heat Sleeves Cutting Machine",
        description: "Developed a microcontroller-based heat sleeve cutting machine using NEMA 23 motors, TB6600 drivers, sensors, and an LED display, achieving high cutting accuracy and reducing manual workload through precise motion control and automation."
      },
      {
        title: "Android Note Application",
        description: "Developed a mobile note-taking app with a clean UI and offline storage.",
        bullets: [
          "Designed and developed a user-friendly Android note-taking app with offline storage using Java and Android Studio, handling UI design, coding, and testing."
        ]
      },
      {
        title: "Internship Projects – D. Samson Industries (Pvt) Ltd",
        description: "",
        bullets: [
          "PLC and HMI Project: Designed and implemented interactive interfaces for automated industrial systems.",
          "RFID Vehicle Entry/Exit Monitoring System: Developed an RFID Vehicle Entry/Exit Monitoring System with a custom Python-based application to automate and control vehicle movement and access at factory gates.",
          "CNC Elastic Marking and Cutting Machine: Engineered a CNC solution for accurate elastic marking and cutting, boosting line productivity."
        ]
      }
    ]
  }
};

export const TRANSLATIONS: Record<'EN' | 'SI', Translations> = {
  EN: {
    nav: {
      brandHome: "Home",
      services: "Services",
      cvMaker: "CV Maker",
      portfolio: "Portfolio",
      home: "About",
      expertise: "Expertise",
      projects: "Projects",
      posts: "Highlights",
      contact: "Contact",
      cv: "MY CV"
    },
    hero: {
      cta: "Explore My Work"
    },
    about: {
      title: "About Me"
    },
    expertise: {
      title: "Education & Expertise",
      subtitle: "My academic journey and technical toolkit",
      education: "Education",
      skills: "Technical Skills",
      uoc: "University of Colombo",
      degree: "BET in Instrumentation and Automation (Hons)",
      gpa: "GPA: 3.05",
      award: "1st Runner-Up",
      awardDesc: "UoC Annual Research Symposium 2024",
      faculty: "Faculty of Technology",
      modules: "Key Modules: Control Systems, Robotics, PLC Programming, Embedded Systems, Industrial Automation, Machine Vision."
    },
    projects: {
      title: "Featured Projects",
      subtitle: "Engineering solutions for complex problems",
      addProject: "Add Project",
      delete: "Delete"
    },
    posts: {
      title: "Special Highlights",
      subtitle: "Updates and achievements from my professional journey",
      addPost: "Add Post",
      delete: "Delete"
    },
    contact: {
      title: "Get In Touch",
      email: "Email",
      phone: "Phone",
      location: "Location"
    },
    admin: {
      login: "Admin Login",
      password: "Password",
      submit: "Login",
      dashboard: "Admin Dashboard",
      editHeadline: "Edit Headline",
      editAbout: "Edit About Me",
      editContact: "Edit Contact Details",
      save: "Save Changes",
      newProject: "Add New Project",
      newPost: "Create New Post",
      manageGallery: "Manage Gallery"
    }
  },
  SI: {
    nav: {
      brandHome: "මුල් පිටුව",
      services: "සේවාවන්",
      cvMaker: "CV සාදන්නා",
      portfolio: "පෝර්ට්ෆෝලියෝ",
      home: "මා ගැන",
      expertise: "පළපුරුද්ද",
      projects: "ව්‍යාපෘති",
      posts: "විශේෂ අවස්ථා",
      contact: "සම්බන්ධතා",
      cv: "මගේ CV"
    },
    hero: {
      cta: "ව්‍යාපෘති බලන්න"
    },
    about: {
      title: "මා ගැන"
    },
    expertise: {
      title: "අධ්‍යාපනය සහ පළපුරුද්ද",
      subtitle: "මගේ අධ්‍යාපනික ගමන සහ තාක්ෂණික කුසලතා",
      education: "අධ්‍යාපනය",
      skills: "තාක්ෂණික කුසලතා",
      uoc: "කොළඹ විශ්ව විද්‍යාලය",
      degree: "BET in Instrumentation and Automation (Hons)",
      gpa: "GPA: 3.05",
      award: "ප්‍රථම අනුශූරතාවය",
      awardDesc: "කොළඹ විශ්ව විද්‍යාලයේ වාර්ෂික පර්යේෂණ සම්මන්ත්‍රණය 2024",
      faculty: "තාක්ෂණ පීඨය",
      modules: "ප්‍රධාන විෂයයන්: පාලන පද්ධති, රොබෝ තාක්ෂණය, PLC ක්‍රමලේඛනය, එම්බෙඩඩ් පද්ධති, කාර්මික ස්වයංක්‍රීයකරණය."
    },
    projects: {
      title: "ප්‍රධාන ව්‍යාපෘති",
      subtitle: "සංකීර්ණ ගැටළු සඳහා ඉංජිනේරු විසඳුම්",
      addProject: "ව්‍යාපෘතියක් එක් කරන්න",
      delete: "මකන්න"
    },
    posts: {
      title: "විශේෂ අවස්ථා",
      subtitle: "මගේ වෘත්තීය ගමනේ තොරතුරු සහ ජයග්‍රහණ",
      addPost: "පෝස්ට් එකක් එක් කරන්න",
      delete: "මකන්න"
    },
    contact: {
      title: "සම්බන්ධ වන්න",
      email: "විද්‍යුත් තැපෑල",
      phone: "දුරකථන",
      location: "ස්ථානය"
    },
    admin: {
      login: "පරිපාලක පිවිසුම",
      password: "මුරපදය",
      submit: "පිවිසෙන්න",
      dashboard: "පරිපාලක පුවරුව",
      editHeadline: "ශීර්ෂ පාඨය සංස්කරණය කරන්න",
      editAbout: "මා ගැන තොරතුරු සංස්කරණය කරන්න",
      editContact: "සම්බන්ධතා තොරතුරු සංස්කරණය කරන්න",
      save: "වෙනස්කම් සුරකින්න",
      newProject: "නව ව්‍යාපෘතියක් එක් කරන්න",
      newPost: "නව පෝස්ට් එකක් එක් කරන්න",
      manageGallery: "ගැලරිය කළමනාකරණය"
    }
  }
};
