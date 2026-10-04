export interface SampleDocument {
  title: string;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    title: 'Work From Home Policy',
    content: 'Employees can work remotely with manager approval.',
  },
  {
    title: 'Leave Policy',
    content: 'Employees receive 20 days of paid annual leave plus sick leave.',
  },
  {
    title: 'Salary Policy',
    content: 'Salaries are reviewed annually and disbursed on the last working day of each month.',
  },
  {
    title: 'Security Policy',
    content: 'Two-factor authentication and device encryption are mandatory for all employees.',
  },
  {
    title: 'Office Timing Policy',
    content: 'Core working hours are 10:00 AM to 5:00 PM Monday through Friday.',
  },
];
