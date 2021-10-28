import React from 'react';
import { Button, Card, CardBody, CardImg, CardTitle, Row, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMouse} from '@fortawesome/free-solid-svg-icons';


const PostCardOne = ({posts}) => {
    return (
        <>
            {
                Array.isArray(posts) ? posts.map(({_id, title, fileUrl, comments, views}) => {
                    return (
                        <div key={_id} className="col-md-4">
                            <Link to={`/post/${_id}`} className="text-dark text-decoration-none">
                                <Card className="mb-3">
                                    <CardImg top alt="카드이미지" src={fileUrl} />
                                    <CardBody>
                                        <CardTitle className="text-trucate d-flex justify-content-between">
                                            <span className="text-trucate"> {title} </span>
                                            <span>
                                                <FontAwesomeIcon icon={faMouse}/>
                                                &nbsp;&nbsp;
                                                <span>{views}</span>
                                            </span>
                                        </CardTitle>
                                        <Row>
                                            <Button color="primary" className="p-2 btn-block">
                                                더보기 <Badge color="light">{comments.length}</Badge>
                                            </Button>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Link>
                        </div>
                    )
                }) : ""
            }
        </>
    )
};

export default PostCardOne;
