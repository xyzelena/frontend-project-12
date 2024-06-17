import { useTranslation } from 'react-i18next';

import { Link, Outlet } from 'react-router-dom';

const Header = () => {
  const { t } = useTranslation();

  return (
    <>
      <header>
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <Link className="navbar-brand" to="/">
              {t('baseTextUI.header')}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Header;