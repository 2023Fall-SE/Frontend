import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Image, Row, Col } from "react-bootstrap";

export const RootLayout = () => {
  const [page, setPage] = useState('nav0');

  const onNavClick = (e) => {
    setPage(e.target.parentElement.id);
  }

  return (
    <Row className="vh-100">
      <Col xs={3}>
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100">
          <Image src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg" alt="Bootstrap" width="72" height="57" className="mb-3" />
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li id='nav0' className="nav-item" onClick={onNavClick}>
              { page === 'nav0' ? (<Link to="search" className="nav-link active">搜尋共乘：目前在此</Link>)
              : (<Link to="search" className="nav-link text-white">搜尋共乘</Link>) }
            </li>
            <li id='nav1' className="nav-item" onClick={onNavClick}>
              { page === 'nav1' ? (<Link to="launch" className="nav-link active">發起共乘：目前在此</Link>)
              : (<Link to="launch" className="nav-link text-white">發起共乘</Link>) }
            </li>
            <li id='nav2' className="nav-item" onClick={onNavClick}>
              { page === 'nav2' ? (<Link to="joined" className="nav-link active">已加入的共乘：目前在此</Link>)
              : (<Link to="joined" className="nav-link text-white">已加入的共乘</Link>) }
            </li>
            <li id='nav3' className="nav-item" onClick={onNavClick}>
              { page === 'nav3' ? (<Link to="ended" className="nav-link active">結束的共乘：目前在此</Link>)
              : (<Link to="ended" className="nav-link text-white">結束的共乘</Link>) }
            </li>
            <li id='nav4' className="nav-item" onClick={onNavClick}>
              { page === 'nav4' ? (<Link to="Login" className="nav-link active">登入頁面：目前在此</Link>)
              : (<Link to="Login" className="nav-link text-white">登入頁面</Link>) }
            </li>
          </ul>
        </div>
      </Col>

      <Col xs={9}>
        <Outlet />
      </Col>
    </Row>
  );
}

export default RootLayout;
