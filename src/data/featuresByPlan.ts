const featuresByPlan = {
  premium: [
    {
      name: 'User segmentation',
      tooltip: 'Segment feedback by user properties like plan, company size, etc...',
      url: 'https://help.featurebase.app/en/articles/9188570-what-are-user-segments',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/1720439474444..png', // No specific image provided for this feature
    },
    {
      name: 'Prioritization module',
      tooltip: 'Rank feedback by value and effort to help you prioritize what to build next.',
      url: 'https://help.featurebase.app/en/articles/8907685-using-prioritization-frameworks',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/01913437-5447-7348-acd5-f5cd96c4d970.png', // No specific image provided for this feature
    },
    {
      name: 'Unlimited boards',
      tooltip: 'Create as many feedback boards as you need for different topics or products.',
      url: 'https://help.featurebase.app/en/articles/1421183-set-up-feedback-boards',
    },
    {
      name: 'API',
      tooltip: 'Get unlimited access to our API to build your own integrations.',
      url: 'https://docs.featurebase.app/',
      img: null, // No specific image provided for this feature
    },
    {
      name: '8 Team members',
      tooltip: 'Add up to 8 team members to help you manage feedback (25$ for additional).',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Users module',
      tooltip:
        'Get an overview of everything a user or a group of users submit on your feedback portal.',
      url: 'https://help.featurebase.app/en/articles/8018515-whats-the-users-module',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/1720432808165..png', // No specific image provided for this feature
    },
    {
      name: 'Comment moderation',
      tooltip: "New comments won't be visible on the public board before you approve them.",
      url: 'https://help.featurebase.app/en/articles/6982593-post-and-comment-moderation',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Custom fields',
      tooltip:
        'Customize the post creation form to collect structured, additional information from your users.',
      url: 'https://help.featurebase.app/en/articles/9231869-custom-fields-for-the-post-form',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/019133a9-3f90-70dd-bcaa-0bb52e4826dc.png', // No specific image provided for this feature
    },
    {
      name: 'Admin roles',
      tooltip:
        'Assign different roles to your managers to control what they can do on your feedback board.',
      url: 'https://help.featurebase.app/en/articles/3863653-admin-roles',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/0190be02-5590-74bd-8c2b-df1e59e0f1a0.png', // No specific image provided for this feature
    },
    {
      name: 'Private tags',
      tooltip: 'Create private tags that are only visible to team members.',
      url: 'https://help.featurebase.app/',
      img: null, // No specific image provided for this feature
    },
  ],
  growth: [
    {
      name: 'AI-duplicate suggestions',
      tooltip:
        'Our AI suggests similar posts to users when posting and gives you an overview of duplicate posts when viewing a post.',
      url: 'https://help.featurebase.app/articles/6974491-merging-duplicate-posts',
      img: '/images/features/ai-suggestions-large.jpg', // No specific image provided for this feature
    },
    {
      name: 'Single Sign-On',
      tooltip:
        "Replace the entire authentication process with your own app's authentication system so users can sign in with their existing credentials.",
      url: 'https://help.featurebase.app/en/articles/0874531-public-portal-single-sign-on-sso',
      img: '/images/onboarding/public-sso.jpg', // No specific image provided for this feature
    },
    {
      name: 'Author-only private posts',
      tooltip:
        'If sensitive information is being discussed, you can selectively keep posts private between the author and admins. This can also be enabled for all posts.',
      url: 'https://help.featurebase.app/en/articles/2990006-author-only-posts',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Email white labeling',
      tooltip: 'Add your own logo and remove Featurebase branding from your notification emails.',
      url: 'https://help.featurebase.app/en/articles/4020449-email-customizations',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/0190be2f-9109-7f62-b069-9dcd735ca787.png', // No specific image provided for this feature
    },
    {
      name: 'Unlimited tags + (private tags)',
      tooltip:
        'Create and use as many tags as you need to organize feedback, including private tags visible only to admins.',
      url: 'https://help.featurebase.app/en/articles/6979960-post-statuses',
      img: null, // No specific image provided for this feature
    },
    {
      name: '6 Team members',
      tooltip: 'Add up to 6 team members to help you manage feedback (25$ for additional).',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'AI-generated changelogs',
      tooltip: 'Let our AI write your changelog releases for you.',
      url: 'https://help.featurebase.app/en/articles/6518299-creating-changelogs-ai-writing#40dxrzpwy86',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/01916be6-adb0-731e-827d-d0bae83f4da3.gif', // No specific image provided for this feature
    },
    {
      name: 'Changelog segmentation',
      tooltip: 'Segment your changelog releases by user properties like plan, company size, etc...',
      url: 'https://help.featurebase.app/articles/2524526-segmenting-changelogs',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/1720439474444..png', // No specific image provided for this feature
    },
    {
      name: '8 boards',
      tooltip: 'Create up to 8 feedback boards for different topics or products.',
      url: 'https://help.featurebase.app/en/articles/1421183-set-up-feedback-boards',
    },
    {
      name: 'Targeted surveys',
      tooltip: 'Send surveys to specific user segments to get more relevant feedback.',
      url: 'https://help.featurebase.app/articles/0183532-targeting-and-segmenting-surveys',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/1720100234460..gif', // No specific image provided for this feature
    },
    {
      name: 'Live support',
      tooltip:
        'Chat with our support team in real-time from the bottom right corner of your dashboard.',
      url: 'https://help.featurebase.app/',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Changelog & Help center localization',
      tooltip:
        'Translate your changelog and help center articles to any of our supported languages.',
      url: 'https://help.featurebase.app/articles/8879098-using-featurebase-in-my-language',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/1720138530852..png', // No specific image provided for this feature
    },
  ],
  starter: [
    {
      name: 'Custom domain',
      tooltip:
        'Serve your Featurebase feedback, changelog & knowledgebase from your domain for an on-brand experience. Example: feedback.yourdomain.com.',
      url: 'https://help.featurebase.app/en/articles/2474184-custom-domains-in-featurebase',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/0190fe06-c589-75e0-9e98-7186a499b296.png', // No specific image provided for this feature
    },
    {
      name: 'Embeddable widgets',
      tooltip:
        'Embed a feedback and changelog widget on your website to more seamlessly collect feedback and share updates with your users.',
      url: 'https://help.featurebase.app/en/articles/3948450-what-are-in-app-widgets',
      img: '/images/onboarding/feedback-widgets.jpg',
    },
    {
      name: 'Core integrations',
      tooltip:
        'Integrate with popular tools like Intercom, Linear, Jira, Discord, Slack, and more.',
      url: 'https://help.featurebase.app/en/articles/7017609-intercom-integration',
      img: null, // No specific image provided for this feature
    },
    {
      name: '4 boards',
      tooltip: 'Create up to 4 feedback boards for different topics or products.',
      url: 'https://help.featurebase.app/en/articles/1421183-set-up-feedback-boards',
    },
    {
      name: 'Moderation tools',
      tooltip: "New posts won't be visible on the public board before you approve them.",
      url: 'https://help.featurebase.app/en/articles/6982593-post-and-comment-moderation',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/0191341e-7ade-75c0-b112-eb80c92fdea7.png', // No specific image provided for this feature
    },
    {
      name: 'Custom statuses & roadmaps',
      tooltip: 'Update default status, create new ones and edit or remove existing ones.',
      url: 'https://help.featurebase.app/en/articles/6979960-post-statuses',
      img: null, // No specific image provided for this feature
    },
    {
      name: '4 Team members',
      tooltip: 'Add up to 4 team members to help you manage feedback (25$ for additional).',
      url: 'https://help.featurebase.app/en/articles/3863653-admin-roles',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Guest posting & voting',
      tooltip: 'Users can create new posts, comment and upvote without having to sign in.',
      url: 'https://help.featurebase.app/en/articles/0480699-anonymous-no-log-in-posting-upvoting-and-commenting',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Custom statuses',
      tooltip: 'Update default status, create new ones and edit or remove existing ones.',
      url: 'https://help.featurebase.app/en/articles/6979960-post-statuses',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Unlimited tags',
      tooltip:
        'Create and use as many tags as you need to organize feedback. (Private tags still require Growth plan upgrade)',
      url: 'https://help.featurebase.app/en/articles/6979960-post-statuses',
      img: null, // No specific image provided for this feature
    },
  ],
  enterprise: [
    {
      name: 'Custom board access',
      tooltip:
        'Have different boards and discussions for different user groups. Ask us for a quote and trial to test it out.',
      url: 'https://help.featurebase.app/en/articles/0157863-role-based-feedback-board-access',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Full white labeling',
      tooltip:
        'Remove all Featurebase branding and fully customize the look and feel of your feedback portal.',
      url: 'https://help.featurebase.app/',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Custom invoicing',
      tooltip: "Get custom payment terms to fit your organization's needs. ",
      url: 'https://help.featurebase.app/',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Azure AD',
      tooltip: 'Implement Azure AD (Microsoft Entra ID) authentication for your feedback portal.',
      url: 'https://help.featurebase.app/',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Personalized onboarding',
      tooltip:
        'Get personalized onboarding and support to help you set up and use Featurebase effectively.',
      url: 'https://help.featurebase.app/',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Security review',
      tooltip:
        "Get a comprehensive security review to ensure Featurebase meets your organization's security requirements.",
      url: 'https://help.featurebase.app/',
      img: null, // No specific image provided for this feature
    },
    {
      name: 'Custom admin roles',
      tooltip:
        "Create custom admin roles with specific permissions to fit your organization's needs.",
      url: 'https://help.featurebase.app/en/articles/3863653-admin-roles',
      img: 'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com/0190be02-5590-74bd-8c2b-df1e59e0f1a0.png', // No specific image provided for this feature
    },
  ],
}

export default featuresByPlan
