// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Some of my academic &amp; personal projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "My CV.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-how-i-added-an-interactive-particle-background-to-my-portfolio",
        
          title: "How I Added an Interactive Particle Background to My Portfolio",
        
        description: "A step-by-step guide to replacing al-folio&#39;s plain white background with an animated, mouse-interactive particle effect using particles.js.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/particle-background-alfolio/";
          
        },
      },{id: "post-the-data-analysis-self-learning-journey-of-an-economics-student-part-iii-power-bi",
        
          title: "The Data Analysis Self-Learning Journey of an Economics Student: Part III -- Power...",
        
        description: "From drag-and-drop dashboards to DAX formulas -- how I picked up Power BI as an economics student.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/power-bi-fundamentals/";
          
        },
      },{id: "post-the-data-analysis-self-learning-journey-of-an-economics-student-part-ii-sql",
        
          title: "The Data Analysis Self-Learning Journey of an Economics Student: Part II -- SQL...",
        
        description: "How I went from zero SQL knowledge to writing window functions, one query at a time.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/sql-fundamentals/";
          
        },
      },{id: "post-the-data-analysis-self-learning-journey-of-an-economics-student-part-i-python",
        
          title: "The Data Analysis Self-Learning Journey of an Economics Student: Part I -- Python...",
        
        description: "How I taught myself Python for data analysis as an economics student, one DataCamp course at a time.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/python-data-fundamentals/";
          
        },
      },{id: "post-beyond-the-classroom-volleyball-logistics-and-finding-balance",
        
          title: "Beyond the Classroom: Volleyball, Logistics, and Finding Balance",
        
        description: "How extracurricular activities at Foreign Trade University shaped me beyond academics.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/extracurricular-activities/";
          
        },
      },{id: "post-my-academic-journey-from-vietnam-to-france",
        
          title: "My Academic Journey: From Vietnam to France",
        
        description: "A look back at the path that brought me from a gifted high school in Binh Dinh to a Master&#39;s program in France.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/my-academic-journey/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-fr-moved-to-france-to-begin-my-french-language-studies-at-university-rennes-2-in-brittany",
          title: ':fr: Moved to France to begin my French language studies at University Rennes...',
          description: "",
          section: "News",},{id: "news-books-completed-my-university-diplomas-in-french-studies-b1-and-b2-at-university-rennes-2-with-scores-of-17-219-20-and-17-124-20",
          title: ':books: Completed my University Diplomas in French Studies (B1 and B2) at University...',
          description: "",
          section: "News",},{id: "news-mortar-board-moved-to-orléans-to-start-my-master-1-in-international-economics-and-sustainable-development-at-the-university-of-orléans",
          title: ':mortar_board: Moved to Orléans to start my Master 1 in International Economics and...',
          description: "",
          section: "News",},{id: "news-1st-place-medal-finished-the-first-semester-of-master-1-ranked-1st-in-my-class-with-an-average-of-15-39-20",
          title: ':1st_place_medal: Finished the first semester of Master 1 ranked 1st in my class...',
          description: "",
          section: "News",},{id: "projects-forecasting-us-energy-consumption-using-arima-models",
          title: 'Forecasting US Energy Consumption Using ARIMA Models',
          description: "A time series study of Personal Consumption Expenditures on Energy (2010-2025)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/arima-energy-forecasting/";
            },},{id: "projects-analysis-of-school-spending-and-4th-grade-math-achievement",
          title: 'Analysis of School Spending and 4th Grade Math Achievement',
          description: "A panel econometrics study of U.S. school districts (1992-1998)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/panel-data-math-achievement/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/rendercv/rendercv_output/Tuyet_Han_LE_CV.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%68%61%6E%74%75%79%65%74%6C%65%32@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
