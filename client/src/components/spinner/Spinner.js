import React from 'react';
import { Row } from 'reactstrap';
import LinearProgress from '@mui/material/LinearProgress';

export const GrowingSpinner = (
    <>
        <Row className="d-flex justify-content-center m-5">
            <LinearProgress color="secondary" />
        </Row>
    </>
);