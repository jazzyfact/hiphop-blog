import React from 'react';
import {Row, Col} from 'reactstrap';
// import {Row, Col} from 'react-bootstrap';

const Header = () => {
    return (
        <div id="page-header" className="mb-3">
            <Row>
                <Col md="6" sm="auto" className="text-center m-auto">
                    {/* <h1>Always Hiphop</h1>
                    <p>힙합블로그</p> */}
                </Col>
            </Row>
        </div>
    )
};

export default Header;