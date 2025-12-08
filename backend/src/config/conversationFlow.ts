export const CONVERSATION_STAGES = {
  INTRODUCTION: {
    stage: 'introduction',
    questions: [
      "Hello! I'm ReqNexa AI, your requirement gathering specialist. I'll help you define clear, complete software requirements for your project. Let's start with the basics: What type of software system are you planning to build?",
      
      "Could you briefly describe the main purpose of this system? What problem does it solve or what need does it fulfill?"
    ]
  },

  CORE_FUNCTIONALITY: {
    stage: 'core_functionality',
    questions: [
      "What are the primary functions or features this system must provide? Please describe the main capabilities users will need.",
      
      "Who are the main users (user roles) of this system? For example: customers, administrators, managers, etc.",
      
      "For [mentioned feature], can you walk me through the step-by-step process? How should a user accomplish this task?",
      
      "Are there any specific business rules or logic that must be enforced? For example: validation rules, calculation formulas, approval workflows?",
      
      "What data does the system need to store and manage? Please list the main types of information."
    ]
  },

  USER_ROLES: {
    stage: 'user_roles',
    questions: [
      "For the [user role] you mentioned, what specific actions or operations should they be able to perform?",
      
      "What should [user role] NOT be able to do? Are there any restrictions or access limitations?",
      
      "How should users authenticate? Username/password, email, social login, biometric, or multi-factor authentication?",
      
      "Are there any role-based permissions or hierarchies? For example: regular users vs. administrators?"
    ]
  },

  NON_FUNCTIONAL: {
    stage: 'non_functional',
    questions: [
      "Let's discuss performance requirements. What are your expectations for system response time? For example: page load time, API response time, search results time?",
      
      "How many concurrent users do you expect the system to handle? What's your anticipated growth over the next 1-2 years?",
      
      "What are your security requirements? Consider: data encryption, secure authentication, user privacy, compliance standards (GDPR, HIPAA, etc.)",
      
      "Are there any specific availability or uptime requirements? For example: 24/7 operation, acceptable downtime for maintenance?",
      
      "What devices and platforms must the system support? Consider: operating systems, browsers, screen sizes, accessibility needs."
    ]
  },

  INTEGRATIONS: {
    stage: 'integrations',
    questions: [
      "Does this system need to integrate with any existing systems or third-party services? Please list them.",
      
      "What data needs to be exchanged with external systems? In what format (JSON, XML, CSV)?",
      
      "Are there any APIs or web services that must be consumed or provided?",
      
      "Does the system need to send notifications? If yes, through which channels: email, SMS, push notifications, in-app?"
    ]
  },

  CONSTRAINTS: {
    stage: 'constraints',
    questions: [
      "Are there any technical constraints or requirements? For example: specific programming languages, frameworks, or technologies that must be used?",
      
      "What's your budget range for this project? This helps scope the features appropriately.",
      
      "What's your expected timeline? When do you need the system to be operational?",
      
      "Are there any regulatory or compliance requirements? For example: data protection laws, industry standards, certifications?",
      
      "What's your hosting preference? Cloud (AWS, Azure, Google Cloud), on-premise, or hybrid?"
    ]
  },

  ERROR_HANDLING: {
    stage: 'error_handling',
    questions: [
      "How should the system handle errors or unexpected situations? Should errors be shown to users or logged silently?",
      
      "What should happen if [critical feature] fails? Is there a fallback or alternative flow?",
      
      "Are there any data validation rules that must be enforced? For example: email format, password strength, date ranges?",
      
      "What should happen with incomplete or invalid user input?"
    ]
  },

  COMPLETION: {
    stage: 'completion',
    questions: [
      "Thank you for providing detailed information. Let me summarize what we've gathered so far: [summary]. Is there anything you'd like to add or clarify?",
      
      "Are there any other requirements, features, or constraints we haven't discussed that are important for this project?",
      
      "Excellent! We've gathered comprehensive requirements for your project. I'll now process this information and generate a structured requirements document. Would you like me to classify these requirements and generate the SRS document?"
    ]
  }
};