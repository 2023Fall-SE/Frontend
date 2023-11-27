import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Image, Row, Col } from "react-bootstrap";
import Header from "./Header"; // Import the Header component

export const RootLayout = () => {
  const [page, setPage] = useState('nav0');

  const onNavClick = (e) => {
    setPage(e.target.parentElement.id);
  }

  return (
    <Row className="vh-100">
      <Col xs={3} className="p-0 sidebar"> {/* Added p-0 to remove default margin */}
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100">
          <Image src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg" alt="Bootstrap" width="72" height="57" className="mb-3" />
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li id='nav0' className="nav-item" onClick={onNavClick}>
              { page === 'nav0' ? (<Link to="search" className="nav-link active">搜尋共乘</Link>)
                : (<Link to="search" className="nav-link text-white">搜尋共乘</Link>) }
            </li>
            <li id='nav1' className="nav-item" onClick={onNavClick}>
              { page === 'nav1' ? (<Link to="launch" className="nav-link active">發起共乘</Link>)
                : (<Link to="launch" className="nav-link text-white">發起共乘</Link>) }
            </li>
            <li id='nav2' className="nav-item" onClick={onNavClick}>
              { page === 'nav2' ? (<Link to="joined" className="nav-link active">已加入的共乘</Link>)
                : (<Link to="joined" className="nav-link text-white">已加入的共乘</Link>) }
            </li>
            <li id='nav3' className="nav-item" onClick={onNavClick}>
              { page === 'nav3' ? (<Link to="ended" className="nav-link active">結束的共乘</Link>)
                : (<Link to="ended" className="nav-link text-white">結束的共乘</Link>) }
            </li>
          </ul>
        </div>
      </Col>
      
      
      <Col xs={9} className="p-0"> {/* Added p-0 to remove default margin */}
        <div className="overflow-auto vh-100"> {/* warp the scrollable object */}
          {/* the Header component */}
          <Header />
        
          {/* The imported carpool page component */}
          <Outlet />
        </div>
      </Col>
    </Row>
  );
}

export default RootLayout;
