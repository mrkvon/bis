import './Footer.css'

const links: (
  | { label: string; url: string }
  | { label: string; todo: string }
)[] = [
  {
    url: 'https://eshop.brontosaurus.cz/',
    label: 'E-shop',
  },
  { label: 'Darujme', url: 'https://www.darujme.cz/organizace/206' },
  {
    label: 'Dárky přírodě',
    url: 'https://darkyprirode.cz/kategorie-produktu/darky-prirode/',
  },
  { label: 'Mozek', url: 'https://mozek.brontosaurus.cz/' },
  { label: 'Rozcestník', todo: 'chybí odkaz' },
  {
    label: 'Zpětná vazba',
    url: 'https://zpetna-vazba.brontosaurus.cz/login.php',
  },
  {
    label: 'Databáze budek',
    url: 'http://peceoprirodu.cz/databaze/sign/in?backlink=kgkmp',
  },
  { label: 'Newslettery', todo: '(asi prokliky na jejich stáhnutí)' },
]

const Footer = () => (
  <footer className="app-footer">
    <nav>
      <ul>
        {links.map(link => (
          <li key={link.label}>
            <a
              href={'url' in link ? link.url : undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} <i>{'todo' in link && `todo: ${link.todo}`}</i>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </footer>
)

export default Footer
