// Books shown on /writing. Nothing renders until `public` is true,
// so titles stay private until you choose to name them.
export interface Book {
  title: string;
  blurb: string;
  status: string; // e.g. "Drafting", "With editor", "Out March 2027"
  color: 'red' | 'yellow' | 'blue';
  link?: string;
  public: boolean;
}

export const books: Book[] = [
  {
    title: 'Working Title',
    blurb: 'One sentence on what the book argues.',
    status: 'Drafting',
    color: 'yellow',
    public: false,
  },
];
