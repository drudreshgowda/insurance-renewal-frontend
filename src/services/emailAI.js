// Email AI Service - Specialized AI Agent for Email Management
// Focused on email composition, sentiment analysis, communication strategies, and customer engagement

const OLLAMA_BASE_URL = 'http://localhost:11434';
const MODEL_NAME = 'gemma3:1b';

// Enhanced system prompt for Email AI Agent
const EMAIL_AI_PROMPT = `You are EmailBot, an intelligent AI assistant specialized in email communication, customer engagement, and email marketing for insurance renewal management. You are the dedicated AI for the Email Manager page and focus exclusively on email-related tasks.

PERSONALITY & IDENTITY:
- Your name is "EmailBot" - introduce yourself as the email communication specialist
- You are an expert in email marketing, customer communication, and engagement strategies
- Maintain context of ongoing email conversations and campaigns
- Be creative and strategic in email composition and optimization
- Show expertise in email analytics and performance improvement

CORE EXPERTISE AREAS:
1. **Email Composition** - Write compelling, personalized email content
2. **Sentiment Analysis** - Analyze customer email sentiment and intent
3. **Response Generation** - Create appropriate responses based on customer emotions
4. **Email Templates** - Design and optimize email templates for different scenarios
5. **Subject Line Optimization** - Create engaging, high-open-rate subject lines
6. **Customer Communication** - Craft empathetic, solution-oriented responses
7. **Email Analytics** - Interpret email performance metrics and suggest improvements
8. **Campaign Strategy** - Develop email campaign strategies for better engagement

RESPONSE STRUCTURE FOR EMAIL ANALYSIS:
**📧 EMAIL ANALYSIS**
• **Sentiment**: [Positive/Negative/Neutral] (Confidence: XX%)
• **Intent**: [Primary customer intent/goal]
• **Urgency**: [High/Medium/Low]
• **Key Points**: [Main issues or requests identified]

**💭 CUSTOMER INSIGHTS**
• **Emotional State**: [Customer's emotional condition]
• **Communication Style**: [Formal/Casual/Frustrated/Appreciative]
• **Relationship Stage**: [New customer/Long-term/At-risk]
• **Priority Level**: [How quickly this needs response]

**✍️ RESPONSE STRATEGY**
• **Recommended Tone**: [Professional/Empathetic/Reassuring/Celebratory]
• **Key Messages**: [Main points to address]
• **Call-to-Action**: [What action customer should take]
• **Follow-up Plan**: [Next steps and timing]

**📝 SMART REPLY OPTIONS**
1. **[Reply Type]**: [Brief description]
   Subject: [Suggested subject line]
   [Email content preview...]

2. **[Reply Type]**: [Brief description]
   Subject: [Suggested subject line]
   [Email content preview...]

RESPONSE STRUCTURE FOR EMAIL COMPOSITION:
**📝 EMAIL COMPOSITION ASSISTANCE**
• **Content Analysis**: [Assessment of current draft]
• **Tone Adjustment**: [Recommendations for tone improvement]
• **Structure Optimization**: [Suggestions for better organization]
• **Engagement Enhancement**: [Ways to increase engagement]

**🎯 OPTIMIZATION SUGGESTIONS**
• **Subject Line**: [Improved subject line options]
• **Opening**: [Better opening lines]
• **Body Content**: [Content improvements]
• **Closing**: [Strong closing statements]
• **Call-to-Action**: [Clear, compelling CTAs]

EMAIL SCENARIOS EXPERTISE:
- **Renewal Reminders**: Timely, personalized renewal notifications
- **Payment Issues**: Empathetic payment problem resolution
- **Policy Updates**: Clear communication of policy changes
- **Customer Complaints**: Professional complaint handling and resolution
- **Appreciation Emails**: Warm customer appreciation and retention
- **Follow-up Communications**: Strategic follow-up sequences
- **Promotional Campaigns**: Engaging promotional email content

SENTIMENT-BASED RESPONSE STRATEGIES:
- **Negative Sentiment**: Empathetic, solution-focused, immediate attention
- **Positive Sentiment**: Appreciative, relationship-building, value-reinforcing
- **Neutral Sentiment**: Professional, informative, clear call-to-action
- **Urgent Issues**: Priority handling, escalation protocols, timeline commitments

FORMATTING RULES:
- Use emojis for section headers (📧, 💭, ✍️, 📝, 🎯)
- Use bullet points (•) for insights and analysis
- Use numbered lists for reply options and suggestions
- Bold important keywords and metrics
- Keep email content concise but complete
- Use professional email formatting

TONE & STYLE:
- Expert in email communication best practices
- Creative and strategic in content creation
- Empathetic and customer-focused
- Data-driven in optimization recommendations
- Professional yet approachable in communication

Remember: You are the email specialist - focus exclusively on email-related tasks, customer communication, and email performance optimization.`;

/**
 * Initialize the Email AI agent
 */
export const initializeEmailAgent = async () => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      throw new Error('Failed to connect to Ollama service for Email AI');
    }
    
    const data = await response.json();
    const models = data.models || [];
    
    if (!models.some(model => model.name.includes(MODEL_NAME))) {
      throw new Error(`Model ${MODEL_NAME} not found. Please pull the model first.`);
    }
    
    return { success: true, message: 'Email AI agent initialized successfully' };
  } catch (error) {
    console.error('Failed to initialize Email AI agent:', error);
    throw error;
  }
};

/**
 * Analyze email content and generate insights
 */
export const analyzeEmail = async (emailData, onChunk = null) => {
  try {
    const analysisPrompt = `Analyze this customer email and provide comprehensive insights:

EMAIL DETAILS:
From: ${emailData.from || 'Customer'}
Subject: ${emailData.subject || 'No Subject'}
Date: ${emailData.date || 'Recent'}
Priority: ${emailData.priority || 'Normal'}

EMAIL CONTENT:
${emailData.body || emailData.content || 'No content provided'}

CUSTOMER CONTEXT:
• Customer Name: ${emailData.renewalContext?.customerName || 'Not specified'}
• Policy Number: ${emailData.renewalContext?.policyNumber || 'Not specified'}
• Renewal Date: ${emailData.renewalContext?.renewalDate || 'Not specified'}
• Previous Interactions: ${emailData.threadHistory?.length || 0} emails in thread

Please provide a detailed analysis including sentiment, intent, urgency, and strategic response recommendations.`;

    return await sendEmailMessage(analysisPrompt, [], onChunk);
  } catch (error) {
    console.error('Email analysis failed:', error);
    throw error;
  }
};

/**
 * Generate smart email replies based on analysis
 */
export const generateSmartReplies = async (emailData, analysisData, aiSettings = {}, onChunk = null) => {
  try {
    const replyPrompt = `Generate smart reply options for this customer email:

ORIGINAL EMAIL:
From: ${emailData.from}
Subject: ${emailData.subject}
Content: ${emailData.body || emailData.content}

EMAIL ANALYSIS:
• Sentiment: ${analysisData.sentiment} (${analysisData.confidence}% confidence)
• Intent: ${analysisData.intent}
• Urgency: ${analysisData.urgency}
• Key Points: ${analysisData.keyPoints?.join(', ') || 'General inquiry'}

CUSTOMER CONTEXT:
• Name: ${analysisData.contextualInfo?.customerName || 'Customer'}
• Policy: ${analysisData.contextualInfo?.policyNumber || 'N/A'}
• Renewal Date: ${analysisData.contextualInfo?.renewalDate || 'N/A'}
• Agent: ${analysisData.contextualInfo?.agentName || 'Support Team'}

AI SETTINGS:
• Tone: ${aiSettings.tone || 'professional'}
• Style: ${aiSettings.style || 'formal'}
• Length: ${aiSettings.length || 'medium'}
• Include Personalization: ${aiSettings.includePersonalization ? 'Yes' : 'No'}
• Language: ${aiSettings.language || 'English'}

Generate 3-4 different reply options with varying approaches (urgent response, detailed explanation, empathetic response, professional acknowledgment).`;

    return await sendEmailMessage(replyPrompt, [], onChunk);
  } catch (error) {
    console.error('Smart reply generation failed:', error);
    throw error;
  }
};

/**
 * Enhance email content with AI suggestions
 */
export const enhanceEmailContent = async (emailDraft, enhancementType = 'general', onChunk = null) => {
  try {
    const enhancementPrompt = `Enhance this email draft to improve its effectiveness:

CURRENT DRAFT:
Subject: ${emailDraft.subject || 'No Subject'}
To: ${emailDraft.to || 'Customer'}
Content:
${emailDraft.body || 'No content provided'}

ENHANCEMENT TYPE: ${enhancementType}
CUSTOMER CONTEXT:
• Policy Number: ${emailDraft.renewalContext?.policyNumber || 'N/A'}
• Customer Name: ${emailDraft.renewalContext?.customerName || 'Customer'}
• Renewal Date: ${emailDraft.renewalContext?.renewalDate || 'N/A'}

Please provide:
1. Enhanced subject line options
2. Improved email content with better structure and engagement
3. Strong call-to-action recommendations
4. Personalization suggestions
5. Tone and style improvements`;

    return await sendEmailMessage(enhancementPrompt, [], onChunk);
  } catch (error) {
    console.error('Email enhancement failed:', error);
    throw error;
  }
};

/**
 * Generate subject line suggestions
 */
export const generateSubjectSuggestions = async (emailContent, context = {}, onChunk = null) => {
  try {
    const subjectPrompt = `Generate compelling subject line options for this email:

EMAIL CONTENT PREVIEW:
${emailContent.substring(0, 300)}...

CONTEXT:
• Email Type: ${context.type || 'General Communication'}
• Customer Name: ${context.customerName || 'Customer'}
• Policy Number: ${context.policyNumber || 'N/A'}
• Urgency: ${context.urgency || 'Normal'}
• Campaign Type: ${context.campaignType || 'Individual Email'}

Generate 8-10 subject line options with different approaches:
- Personalized options
- Urgency-driven options  
- Benefit-focused options
- Question-based options
- Action-oriented options

Include open rate optimization tips for each suggestion.`;

    return await sendEmailMessage(subjectPrompt, [], onChunk);
  } catch (error) {
    console.error('Subject line generation failed:', error);
    throw error;
  }
};

/**
 * Analyze email campaign performance
 */
export const analyzeCampaignPerformance = async (campaignData, onChunk = null) => {
  try {
    const performancePrompt = `Analyze this email campaign performance and provide optimization recommendations:

CAMPAIGN METRICS:
• Campaign Name: ${campaignData.name || 'Email Campaign'}
• Emails Sent: ${campaignData.sent || 0}
• Delivered: ${campaignData.delivered || 0} (${campaignData.deliveryRate || 0}%)
• Opened: ${campaignData.opened || 0} (${campaignData.openRate || 0}%)
• Clicked: ${campaignData.clicked || 0} (${campaignData.clickRate || 0}%)
• Responses: ${campaignData.responses || 0}
• Unsubscribes: ${campaignData.unsubscribes || 0}

CAMPAIGN DETAILS:
• Subject Line: ${campaignData.subject || 'Not specified'}
• Send Date: ${campaignData.sendDate || 'Recent'}
• Target Audience: ${campaignData.audience || 'General'}
• Campaign Type: ${campaignData.type || 'Renewal'}

Provide detailed analysis with specific recommendations for improving performance.`;

    return await sendEmailMessage(performancePrompt, [], onChunk);
  } catch (error) {
    console.error('Campaign analysis failed:', error);
    throw error;
  }
};

/**
 * Core message sending function for Email AI
 */
const sendEmailMessage = async (message, context = [], onChunk = null) => {
  try {
    const recentContext = context.slice(-6);
    
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: EMAIL_AI_PROMPT,
          },
          ...recentContext.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
          {
            role: 'user',
            content: `${message}

Please provide a comprehensive response using the structured format specified in your system prompt for email-related tasks.`,
          },
        ],
        stream: true,
        options: {
          temperature: 0.4,
          top_p: 0.9,
          num_ctx: 4096,
          num_predict: 2000,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Email AI Error: ${errorData.error || response.statusText}`);
    }

    // Handle streaming response
    if (onChunk && typeof onChunk === 'function') {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.message && data.message.content) {
                fullContent += data.message.content;
                onChunk(data.message.content, fullContent);
              }
              
              if (data.done) {
                return {
                  message: {
                    content: fullContent,
                  },
                  done: true,
                };
              }
            } catch (parseError) {
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        message: {
          content: fullContent,
        },
        done: true,
      };
    } else {
      // Non-streaming fallback
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Email AI Error:', error);
    throw error;
  }
};

const emailAI = {
  initializeEmailAgent,
  analyzeEmail,
  generateSmartReplies,
  enhanceEmailContent,
  generateSubjectSuggestions,
  analyzeCampaignPerformance,
  sendEmailMessage
};

export default emailAI; 