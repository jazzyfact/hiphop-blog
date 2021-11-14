import React from 'react';
import { Row, Spinner } from 'reactstrap';
import Stack from '@mui/material/Stack';
import {CircularProgress} from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

export const GrowingSpinner = (
    <>
        <Row className="d-flex justify-content-center m-5">
            <LinearProgress color="secondary" />
        </Row>
    </>
);