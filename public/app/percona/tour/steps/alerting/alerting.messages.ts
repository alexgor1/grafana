export const Messages = {
  firedAlerts: {
    title: 'Fired Alerts',
    view: 'View all the alerts generated by your active alert rules.',
    check: 'Check this tab regularly for an overview of current issues in your environment.',
  },
  alertRuleTemplates: {
    title: 'Alert Rule Templates',
    effortlessly: 'Templates help you create complex alert rules effortlessly.',
    offers:
      'Percona offers a set of default templates for common events and expressions, but you can also create custom templates to fit your unique requirements.',
  },
  alertRules: {
    title: 'Alert Rules',
    rules: 'Alert rules specify the conditions for firing alerts.',
    start:
      'Start from your available templates to pre-fill some of these conditions, and create your rule by adding more conditions and changing the template values.',
    create: "If you need to create an alert rule from scratch, use Grafana's complex alerting configuration instead.",
  },
  contactPoints: {
    title: 'Contact Points',
    define: 'Define how your contacts are notified when an alert fires.',
    grafana:
      'Grafana supports a multitude of ChatOps tools to ensure that your team is notified via the most relevant channel.',
  },
  notificationPolicies: {
    title: 'Notification Policies',
    routed: 'Set where, when, and how the alerts get routed.',
    policy: 'A notification policy has a contact point assigned to it that consists of one or more notifiers.',
  },
  silences: {
    title: 'Silences',
    create: 'Create silences when you want to stop notifications from one or more alerting rules.',
    silences:
      'Silences will prevent notifications from getting created, but they will not prevent alerting rules from being evaluated or recorded in the Fired Alerts tab. A silence only lasts for a specified window of time.',
  },
  alertGroups: {
    title: 'Alert Groups',
    alert: 'Alert Groups show grouped alerts.',
    grouping: "Group common alerts into a single alert group to ensure that PMM doesn't fire duplicate alerts.",
  },
  admin: {
    title: 'Admin',
    configure: 'Use this to configure Alertmanagers in raw JSON format.',
  },
};
