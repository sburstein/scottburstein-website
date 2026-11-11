// One place for everything that names you or points at your accounts.
export const site = {
  name: 'Scott Burstein',
  line: 'I write nonfiction and build small tools. New York.',
  substack: 'https://scottburstein.substack.com',
  letterboxdUser: 'scottburstein',
  // The number in goodreads.com/user/show/88883959-scott
  goodreadsUserId: '88883959',
  links: [
    { label: 'GitHub', href: 'https://github.com/sburstein' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/scott-burstein' },
    { label: 'Email', href: 'mailto:scott.burstein@gmail.com' },
  ],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Writing', href: '/writing' },
    { label: 'Notebook', href: '/notebook' },
  ],
};

// Pages that read live feeds are rendered on request and cached at the edge:
// fresh for 30 minutes, then served stale while a new copy is fetched.
export const FEED_CACHE = 'public, s-maxage=1800, stale-while-revalidate=86400';
